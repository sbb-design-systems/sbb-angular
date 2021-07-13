import { FocusableOption, FocusKeyManager } from '@angular/cdk/a11y';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { ENTER, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { fromEvent, merge, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

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
 * The scroll state of the tabs header. 'hidden' implies no scrollbar, 'middle' indicates
 * the scrollbar is in the middle of the scroll width and 'left' and 'right' means
 * it is either on the left or right end of the scroll container.
 */
export type SbbTabHeaderScrollState = 'hidden' | 'middle' | 'left' | 'right';

/** Item inside a paginated tab header. */
export type SbbPaginatedTabHeaderItem = FocusableOption & { elementRef: ElementRef };

/**
 * Base class for a tab header that supports pagination.
 * @docs-private
 */
@Directive()
export abstract class SbbPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  abstract _items: QueryList<SbbPaginatedTabHeaderItem>;
  abstract _tabListContainer: ElementRef<HTMLElement>;
  abstract _tabList: ElementRef<HTMLElement>;

  /** Trigger a scroll shadow check. */
  private _scrollShadowTrigger = new Subject<void>();

  /** Whether the header should scroll to the selected index after the view has been checked. */
  private _selectedIndexChanged = false;

  /** Emits when the component is destroyed. */
  protected readonly _destroyed: Subject<void> = new Subject<void>();

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

  /** The index of the active tab. */
  get selectedIndex(): number {
    return this._selectedIndex;
  }
  set selectedIndex(value: number) {
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
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string
  ) {}

  /** Called when the user has selected an item via the keyboard. */
  protected abstract _itemSelected(event: KeyboardEvent): void;

  ngAfterViewInit() {
    const resize = this._viewportRuler.change(150);
    this._ngZone.runOutsideAngular(() => {
      merge(
        fromEvent(this._tabListContainer.nativeElement, 'scroll', passiveEventListenerOptions),
        this._scrollShadowTrigger,
        resize
      )
        .pipe(
          startWith(null! as any),
          map(() => this._calculateScrollState()),
          distinctUntilChanged(),
          takeUntil(this._destroyed)
        )
        .subscribe((state) => this._applyScrollShadows(state));
    });
  }

  ngAfterContentInit() {
    const realign = () => this.updatePagination();

    this._keyManager = new FocusKeyManager<SbbPaginatedTabHeaderItem>(this._items)
      .withHorizontalOrientation('ltr')
      .withHomeAndEnd()
      .withWrap();

    this._keyManager.updateActiveItem(this._selectedIndex);

    // Defer the first call in order to allow for slower browsers to lay out the elements.
    // This helps in cases where the user lands directly on a page with paginated tabs.
    typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(realign) : realign();

    // If there is a change in the focus key manager we need to emit the `indexFocused`
    // event in order to provide a public event that notifies about focus changes. Also we realign
    // the tabs container by scrolling the new focused tab into the visible section.
    this._keyManager.change.pipe(takeUntil(this._destroyed)).subscribe((newFocusIndex) => {
      this.indexFocused.emit(newFocusIndex);
      this._setTabFocus(newFocusIndex);
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
      this._selectedIndexChanged = false;
      this._changeDetectorRef.markForCheck();
    }

    // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
    // then translate the header to reflect this.
    if (this._scrollDistanceChanged) {
      this._scrollDistanceChanged = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
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
    this._scrollShadowTrigger.next();
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
    if (this._items && this._items.length) {
      this._items.toArray()[tabIndex].focus();
      this._scrollToLabel(tabIndex);
    }
  }

  /**
   * Moves the tab list such that the desired tab label (marked by index) is moved into view.
   */
  _scrollToLabel(labelIndex: number) {
    const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;
    if (!selectedLabel) {
      return;
    }

    const containerElement = this._tabListContainer.nativeElement;
    // The view length is the visible width of the tab labels.
    const viewLength = containerElement.offsetWidth;
    const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;

    const labelBeforePos = offsetLeft;
    const labelAfterPos = labelBeforePos + offsetWidth;

    if (labelBeforePos < containerElement.scrollLeft) {
      containerElement.scrollTo({ left: labelBeforePos, behavior: 'smooth' });
    } else if (viewLength + containerElement.scrollLeft < labelAfterPos) {
      containerElement.scrollTo({ left: labelAfterPos - viewLength, behavior: 'smooth' });
    }
  }

  /**
   * Determines what is the maximum length in pixels that can be set for the scroll distance. This
   * is equal to the difference in width between the tab list container and tab header container.
   */
  _getMaxScrollDistance(): number {
    const lengthOfTabList = this._tabList.nativeElement.scrollWidth;
    const viewLength = this._tabListContainer.nativeElement.offsetWidth;
    return lengthOfTabList - viewLength || 0;
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

  static ngAcceptInputType_selectedIndex: NumberInput;
}
