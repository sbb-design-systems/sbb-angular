import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ANIMATION_MODULE_TYPE,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
} from '@angular/core';
import { mixinVariant } from '@sbb-esta/angular/core';
import { fromEvent, merge, Subject, timer } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true,
}) as EventListenerOptions;

/**
 * The directions that scrolling can go in when the header's tabs exceed the header width. 'After'
 * will scroll the header towards the end of the tabs list and 'before' will scroll towards the
 * beginning of the list.
 */
export type ScrollDirection = 'after' | 'before';

/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
const EXAGGERATED_OVERSCROLL = 60;

/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
const HEADER_SCROLL_DELAY = 650;

/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 */
const HEADER_SCROLL_INTERVAL = 100;

/** Item inside a paginated tab header. */
export type SbbPaginatedTabHeaderItem = FocusableOption & { elementRef: ElementRef };

/**
 * The scroll state of the tabs header. 'hidden' implies no scrollbar, 'middle' indicates
 * the scrollbar is in the middle of the scroll width and 'left' and 'right' means
 * it is either on the left or right end of the scroll container.
 */
export type SbbTabHeaderScrollState = 'hidden' | 'middle' | 'left' | 'right';

// Boilerplate for applying mixins to SbbPaginatedTabHeader.
// tslint:disable-next-line:naming-convention
const _SbbPaginatedTabHeaderMixinBase = mixinVariant(class {});

/**
 * Base class for a tab header that supports pagination.
 * @docs-private
 */
@Directive()
export abstract class SbbPaginatedTabHeader
  extends _SbbPaginatedTabHeaderMixinBase
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  abstract _items: QueryList<SbbPaginatedTabHeaderItem>;
  abstract _tabListContainer: ElementRef<HTMLElement>;
  abstract _tabList: ElementRef<HTMLElement>;
  abstract _tabListInner: ElementRef<HTMLElement>;
  abstract _nextPaginator: ElementRef<HTMLElement>;
  abstract _previousPaginator: ElementRef<HTMLElement>;

  /** Trigger a scroll shadow check. */
  private _scrollShadowTrigger = new Subject<void>();

  /** The distance in pixels that the tab labels should be translated to the left. */
  private _scrollDistance = 0;

  /** Whether the header should scroll to the selected index after the view has been checked. */
  private _selectedIndexChanged = false;

  /** Emits when the component is destroyed. */
  protected readonly _destroyed: Subject<void> = new Subject<void>();

  /** Whether the controls for pagination should be displayed */
  _showPaginationControls: boolean = false;

  /** Whether the tab list can be scrolled more towards the end of the tab label list. */
  _disableScrollAfter: boolean = true;

  /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
  _disableScrollBefore: boolean = true;

  /**
   * The number of tab labels that are displayed on the header. When this changes, the header
   * should re-evaluate the scroll position.
   */
  private _tabLabelCount: number;

  /** Whether the scroll distance has changed and should be applied after the view is checked. */
  private _scrollDistanceChanged: boolean;

  /** Used to manage focus between the tabs. */
  private _keyManager: FocusKeyManager<SbbPaginatedTabHeaderItem>;

  /** Cached text content of the header. */
  private _currentTextContent: string;

  /** Stream that will stop the automated scrolling. */
  private _stopScrolling = new Subject<void>();

  /**
   * Whether pagination should be disabled. This can be used to avoid unnecessary
   * layout recalculations if it's known that pagination won't be required.
   * This applies only for lean design.
   */
  @Input()
  get disablePagination(): boolean {
    return this._disablePagination;
  }
  set disablePagination(value: BooleanInput) {
    this._disablePagination = coerceBooleanProperty(value);
  }
  private _disablePagination: boolean = false;

  /** The index of the active tab. */
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: NumberInput) {
    value = coerceNumberProperty(value);

    if (this._selectedIndex !== value) {
      this._selectedIndexChanged = true;
      this._selectedIndex = value;

      if (this._keyManager) {
        this._keyManager.updateActiveItem(value);
      }
    }
  }
  private _selectedIndex: number = 0;

  /** Event emitted when the option is selected. */
  readonly selectFocusedIndex: EventEmitter<number> = new EventEmitter<number>();

  /** Event emitted when a label is focused. */
  readonly indexFocused: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    protected _changeDetectorRef: ChangeDetectorRef,
    private _viewportRuler: ViewportRuler,
    private _ngZone: NgZone,
    private _platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string,
  ) {
    super();
    // Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
    _ngZone.runOutsideAngular(() => {
      fromEvent(_elementRef.nativeElement, 'mouseleave')
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => {
          this._stopInterval();
        });
    });
  }

  /** Called when the user has selected an item via the keyboard. */
  protected abstract _itemSelected(event: KeyboardEvent): void;

  ngAfterViewInit() {
    // We need to handle these events manually, because we want to bind passive event listeners.
    fromEvent(this._previousPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._handlePaginatorPress('before');
      });

    fromEvent(this._nextPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._handlePaginatorPress('after');
      });
  }

  ngAfterContentInit() {
    const resize = this._viewportRuler.change(150);
    const realign = () => this.updatePagination();
    this._keyManager = new FocusKeyManager<SbbPaginatedTabHeaderItem>(this._items)
      .withHorizontalOrientation('ltr')
      .withHomeAndEnd()
      .withWrap();

    this._keyManager.updateActiveItem(this._selectedIndex);

    // Defer the first call in order to allow for slower browsers to lay out the elements.
    // This helps in cases where the user lands directly on a page with paginated tabs.
    // Note that we use `onStable` instead of `requestAnimationFrame`, because the latter
    // can hold up tests that are in a background tab.
    this._ngZone.onStable.pipe(take(1)).subscribe(realign);

    // On window resize, items change or variant change, realign
    merge(resize, this._items.changes, this.variant)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        // We need to defer this to give the browser some time to recalculate
        // the element dimensions. The call has to be wrapped in `NgZone.run`,
        // because the viewport change handler runs outside of Angular.
        this._ngZone.run(() => {
          Promise.resolve().then(() => {
            // Clamp the scroll distance, because it can change with the number of tabs.
            this._scrollDistance = Math.max(
              0,
              Math.min(this._getMaxScrollDistance(), this._scrollDistance),
            );
            realign();
          });
        });
      });

    // If there is a change in the focus key manager we need to emit the `indexFocused`
    // event in order to provide a public event that notifies about focus changes. Also we realign
    // the tabs container by scrolling the new focused tab into the visible section.
    this._keyManager.change.subscribe((newFocusIndex) => {
      this.indexFocused.emit(newFocusIndex);
      this._setTabFocus(newFocusIndex);
    });

    // Calculate scroll shadows only in standard design
    this._ngZone.runOutsideAngular(() => {
      this.variant
        .pipe(
          filter((variant) => variant === 'standard'),
          switchMap(() =>
            merge(
              fromEvent(
                this._tabListContainer.nativeElement,
                'scroll',
                passiveEventListenerOptions,
              ),
              this._scrollShadowTrigger,
              resize,
            ),
          ),
          startWith(null! as any),
          map(() => this._calculateScrollState()),
          distinctUntilChanged(),
          takeUntil(this._destroyed),
        )
        .subscribe((state) => this._applyScrollShadows(state));
    });

    // Reset transform and scrolling when switching design variant in showcase
    this._ngZone.runOutsideAngular(() => {
      this.variant.pipe(takeUntil(this._destroyed)).subscribe((variant) => {
        if (variant === 'lean') {
          this._tabListContainer.nativeElement.scrollLeft = 0;
        } else {
          this._tabList.nativeElement.style.removeProperty('transform');
        }
      });
    });
  }

  ngAfterContentChecked(): void {
    // If the number of tab labels have changed, check if scrolling should be enabled
    if (this._tabLabelCount !== this._items.length) {
      this.updatePagination();
      this._tabLabelCount = this._items.length;
      this._changeDetectorRef.markForCheck();
    }

    // If the selected index has changed, scroll to the label and check if the scrolling controls
    // should be disabled.
    if (this._selectedIndexChanged) {
      this._scrollToLabel(this._selectedIndex);
      this._checkScrollingControls();
      this._selectedIndexChanged = false;
      this._changeDetectorRef.markForCheck();
    }

    // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
    // then translate the header to reflect this.
    if (this._scrollDistanceChanged) {
      this._updateTabScrollPosition();
      this._scrollDistanceChanged = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    this._keyManager?.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this._stopScrolling.complete();
  }

  /** Handles keyboard events on the header. */
  _handleKeydown(event: KeyboardEvent) {
    // We don't handle any key bindings with a modifier key.
    if (hasModifierKey(event)) {
      return;
    }

    switch (event.keyCode) {
      case ENTER:
      case SPACE:
        if (this.focusIndex !== this.selectedIndex) {
          this.selectFocusedIndex.emit(this.focusIndex);
          this._itemSelected(event);
        }
        break;
      default:
        this._keyManager.onKeydown(event);
    }
  }

  /**
   * Callback for when the MutationObserver detects that the content has changed.
   */
  _onContentChanges() {
    const textContent = this._elementRef.nativeElement.textContent;

    // We need to diff the text content of the header, because the MutationObserver callback
    // will fire even if the text content didn't change which is inefficient and is prone
    // to infinite loops if a poorly constructed expression is passed in (see #14249).
    if (textContent !== this._currentTextContent) {
      this._currentTextContent = textContent || '';

      // The content observer runs outside the `NgZone` by default, which
      // means that we need to bring the callback back in ourselves.
      this._ngZone.run(() => {
        this.updatePagination();
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  /**
   * Updates the view whether pagination should be enabled or not.
   *
   * WARNING: Calling this method can be very costly in terms of performance. It should be called
   * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
   * page.
   */
  updatePagination() {
    this._checkPaginationEnabled();
    this._checkScrollingControls();
    this._updateTabScrollPosition();
  }

  /** Tracks which element has focus; used for keyboard navigation */
  get focusIndex(): number {
    return this._keyManager ? this._keyManager.activeItemIndex! : 0;
  }

  /** When the focus index is set, we must manually send focus to the correct label */
  set focusIndex(value: number) {
    if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
      return;
    }

    this._keyManager.setActiveItem(value);
  }

  /**
   * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
   * providing a valid index and return true.
   */
  _isValidIndex(index: number): boolean {
    if (!this._items) {
      return true;
    }

    const tab = this._items ? this._items.toArray()[index] : null;
    return !!tab && !tab.disabled;
  }

  /**
   * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
   * scrolling is enabled.
   */
  _setTabFocus(tabIndex: number) {
    if (this._showPaginationControls) {
      this._scrollToLabel(tabIndex);
    }

    if (this._items && this._items.length) {
      this._items.toArray()[tabIndex].focus();

      // Do not let the browser manage scrolling to focus the element, this will be handled
      // by using translation.
      this._tabListContainer.nativeElement.scrollLeft = 0;
    }
  }

  /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
  _updateTabScrollPosition() {
    if (this.disablePagination || this.variantSnapshot === 'standard') {
      return;
    }

    const scrollDistance = this.scrollDistance;
    const translateX = -scrollDistance;

    // Don't use `translate3d` here because we don't want to create a new layer.
    // We round the `transform` here, because transforms with sub-pixel precision cause some
    // browsers to blur the content of the element.
    this._tabList.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;

    // Setting the `transform` on IE will change the scroll offset of the parent, causing the
    // position to be thrown off in some cases. We have to reset it ourselves to ensure that
    // it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
    // with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
    if (this._platform.TRIDENT || this._platform.EDGE) {
      this._tabListContainer.nativeElement.scrollLeft = 0;
    }
  }

  /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
  get scrollDistance(): number {
    return this._scrollDistance;
  }
  set scrollDistance(value: number) {
    this._scrollTo(value);
  }

  /**
   * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
   * the end of the list, respectively). The distance to scroll is computed to be a third of the
   * length of the tab list view window.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _scrollHeader(direction: ScrollDirection) {
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;

    // Move the scroll distance one-third the length of the tab list's viewport.
    const scrollAmount = ((direction === 'before' ? -1 : 1) * viewLength) / 3;

    return this._scrollTo(this._scrollDistance + scrollAmount);
  }

  /** Handles click events on the pagination arrows. */
  _handlePaginatorClick(direction: ScrollDirection) {
    this._stopInterval();
    this._scrollHeader(direction);
  }

  /**
   * Moves the tab list such that the desired tab label (marked by index) is moved into view.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _scrollToLabel(labelIndex: number) {
    if (this.disablePagination || this.variantSnapshot === 'standard') {
      return;
    }

    const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;

    if (!selectedLabel) {
      return;
    }

    // The view length is the visible width of the tab labels.
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;

    const labelBeforePos = offsetLeft;
    const labelAfterPos = labelBeforePos + offsetWidth;

    const beforeVisiblePos = this.scrollDistance;
    const afterVisiblePos = this.scrollDistance + viewLength;

    if (labelBeforePos < beforeVisiblePos) {
      // Scroll header to move label to the before direction
      this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
    } else if (labelAfterPos > afterVisiblePos) {
      // Scroll header to move label to the after direction
      this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
    }
  }

  /**
   * Evaluate whether the pagination controls should be displayed. If the scroll width of the
   * tab list is wider than the size of the header container, then the pagination controls should
   * be shown.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _checkPaginationEnabled() {
    if (this.disablePagination || this.variantSnapshot === 'standard') {
      this._showPaginationControls = false;
    } else {
      // Allow difference delta of 1px to avoid falsy enabled pagination if browser has zoom levels other than 100%
      const isEnabled =
        this._tabListInner.nativeElement.scrollWidth - this._elementRef.nativeElement.offsetWidth >
        1;

      if (!isEnabled) {
        this.scrollDistance = 0;
      }

      if (isEnabled !== this._showPaginationControls) {
        this._changeDetectorRef.markForCheck();
      }

      this._showPaginationControls = isEnabled;
    }
  }

  /**
   * Evaluate whether the before and after controls should be enabled or disabled.
   * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
   * before button. If the header is at the end of the list (scroll distance is equal to the
   * maximum distance we can scroll), then disable the after button.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _checkScrollingControls() {
    if (this.disablePagination || this.variantSnapshot === 'standard') {
      this._disableScrollAfter = this._disableScrollBefore = true;
    } else {
      // Check if the pagination arrows should be activated.
      this._disableScrollBefore = this.scrollDistance === 0;
      this._disableScrollAfter = this.scrollDistance === this._getMaxScrollDistance();
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Determines what is the maximum length in pixels that can be set for the scroll distance. This
   * is equal to the difference in width between the tab list container and tab header container.
   *
   * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
   * should be called sparingly.
   */
  _getMaxScrollDistance(): number {
    const lengthOfTabList = this._tabListInner.nativeElement.scrollWidth;
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    return lengthOfTabList - viewLength || 0;
  }

  /** Stops the currently-running paginator interval.  */
  _stopInterval() {
    this._stopScrolling.next();
  }

  /**
   * Handles the user pressing down on one of the paginators.
   * Starts scrolling the header after a certain amount of time.
   * @param direction In which direction the paginator should be scrolled.
   */
  _handlePaginatorPress(direction: ScrollDirection, mouseEvent?: MouseEvent) {
    // Don't start auto scrolling for right mouse button clicks. Note that we shouldn't have to
    // null check the `button`, but we do it so we don't break tests that use fake events.
    if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
      return;
    }

    // Avoid overlapping timers.
    this._stopInterval();

    // Start a timer after the delay and keep firing based on the interval.
    timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
      // Keep the timer going until something tells it to stop or the component is destroyed.
      .pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
      .subscribe(() => {
        const { maxScrollDistance, distance } = this._scrollHeader(direction);

        // Stop the timer if we've reached the start or the end.
        if (distance === 0 || distance >= maxScrollDistance) {
          this._stopInterval();
        }
      });
  }

  /**
   * Scrolls the header to a given position.
   * @param position Position to which to scroll.
   * @returns Information on the current scroll distance and the maximum.
   */
  private _scrollTo(position: number) {
    if (this.disablePagination || this.variantSnapshot === 'standard') {
      return { maxScrollDistance: 0, distance: 0 };
    }

    const maxScrollDistance = this._getMaxScrollDistance();
    this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));

    // Mark that the scroll distance has changed so that after the view is checked, the CSS
    // transformation can move the header.
    this._scrollDistanceChanged = true;
    this._checkScrollingControls();

    return { maxScrollDistance, distance: this._scrollDistance };
  }

  /**
   * Calculate whether the scroll shadows should be hidden or shown left, right or on both sides.
   */
  private _calculateScrollState(): SbbTabHeaderScrollState {
    const element = this._tabListContainer.nativeElement;
    if (element.scrollWidth === element.offsetWidth) {
      return 'hidden';
    }
    const isAtStart = element.scrollLeft === 0;
    // In some cases the combined value of scrollLeft and offsetWidth is off by
    // 1 pixel from the scrollWidth.
    const isAtEnd = element.scrollWidth - element.scrollLeft - element.offsetWidth <= 1;
    return !isAtStart && !isAtEnd ? 'middle' : isAtStart ? 'left' : 'right';
  }

  /**
   * Apply the scroll shadow state. Adds or removes the appropriate css classes
   * for the shadow.
   * We do this manually due to being in a subclass and outside of Angular's
   * change detection.
   * @param state The state of the scroll shadows.
   */
  private _applyScrollShadows(state: SbbTabHeaderScrollState) {
    const element = this._elementRef.nativeElement;
    if (state === 'hidden' || state === 'left') {
      element.classList.remove('sbb-tab-header-left-shadow');
    } else {
      element.classList.add('sbb-tab-header-left-shadow');
    }
    if (state === 'hidden' || state === 'right') {
      element.classList.remove('sbb-tab-header-right-shadow');
    } else {
      element.classList.add('sbb-tab-header-right-shadow');
    }
  }
}
