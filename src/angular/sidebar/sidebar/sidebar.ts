// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  ConfigurableFocusTrapFactory,
  FocusMonitor,
  FocusOrigin,
  FocusTrap,
} from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ViewportRuler } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import {
  AfterContentInit,
  afterNextRender,
  ANIMATION_MODULE_TYPE,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { BehaviorSubject, combineLatest, fromEvent, merge, NEVER, Observable, Subject } from 'rxjs';
import { filter, map, mapTo, startWith, take, takeUntil } from 'rxjs/operators';

import {
  SbbSidebarBase,
  SbbSidebarContainerBase,
  SbbSidebarContentBase,
  SbbSidebarMobileCapableContainer,
  SBB_SIDEBAR_CONTAINER,
} from '../sidebar-base';

/** Result of the toggle promise that indicates the state of the sidebar. */
export type SbbSidebarToggleResult = 'open' | 'close';

/** Sidebar display modes. */
export type SbbSidebarMode = 'over' | 'side';

@Component({
  selector: 'sbb-sidebar-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-sidebar-content sbb-scrollbar',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CdkScrollable,
      useExisting: SbbSidebarContent,
    },
  ],
})
export class SbbSidebarContent extends SbbSidebarContentBase implements AfterContentInit {
  _container: SbbSidebarContainer = inject(SbbSidebarContainer);
  _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
}

@Component({
  selector: 'sbb-sidebar',
  exportAs: 'sbbSidebar',
  templateUrl: './sidebar.html',
  host: {
    class: 'sbb-sidebar',
    tabIndex: '-1',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.sbb-sidebar-over]': 'mode === "over"',
    '[class.sbb-sidebar-mobile]': '_mobile',
    '[class.sbb-sidebar-side]': 'mode === "side"',
    '[class.sbb-sidebar-opened]': 'opened',
    '[class.sbb-sidebar-collapsible]': 'collapsible',
    '[style.visibility]': '(!_container && !opened) ? "hidden" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkScrollable, SbbIcon],
})
export class SbbSidebar extends SbbSidebarBase implements AfterContentInit, OnDestroy {
  private _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private _focusMonitor = inject(FocusMonitor);
  private _ngZone = inject(NgZone);
  private _renderer = inject(Renderer2);
  override _container: SbbSidebarContainer = inject<SbbSidebarContainer>(SBB_SIDEBAR_CONTAINER);
  private _router = inject(Router, { optional: true });

  _labelCloseSidebar: string = $localize`:Button label to close the sidebar@@sbbSidebarCloseSidebar:Close Sidebar`;

  /** Whether the sidebar is in mobile mode. */
  _mobile: boolean = false;

  /** Whether the sidebar is collapsible. */
  @Input({ transform: booleanAttribute })
  set collapsible(value: boolean) {
    this._collapsible = value;
    this.mode = value || this._mobile ? 'over' : 'side';

    if (!this._collapsible && !this.opened) {
      this.open();
    }
  }
  get collapsible(): boolean {
    return this._collapsible;
  }
  _collapsible: boolean = false;

  /** Optional title to display in the sidebar header next to the close icon if sidebar is collapsible. */
  @Input() collapsibleTitle?: string | null;

  /** Mode of the sidebar; one of 'over', or 'side'. */
  get mode(): SbbSidebarMode {
    return this._mode;
  }
  set mode(value: SbbSidebarMode) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }

  /**
   * Whether the collapsible sidebar is opened.
   */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: BooleanInput) {
    this._openedViaInput = true;
    this.toggle(coerceBooleanProperty(value));
  }
  private _opened: boolean = true;

  /**
   * Whether the `opened` state was set via the @Input.
   * If true, the sidebar will not be toggled automatically if the mobile state changes.
   */
  private _openedViaInput: boolean = false;

  /** Emits whenever the sidebar has started animating. */
  readonly _animationStarted = new Subject<TransitionEvent | void>();

  /** Emits whenever the sidebar is done animating. */
  readonly _animationEnd = new Subject<TransitionEvent | void>();

  /**
   * Name of the svg icon for the trigger on mobile devices.
   */
  @Input() set triggerSvgIcon(value: string) {
    this._triggerSvgIconSubject.next(value);
  }
  get triggerSvgIcon(): string | null {
    return this._triggerSvgIconSubject.value;
  }
  private _triggerSvgIconSubject = new BehaviorSubject<string | null>(null);

  /** Event emitted when the sidebar has started opening. */
  @Output()
  readonly openedStart: Observable<void> = this._animationStarted.pipe(
    filter(() => this.opened),
    mapTo(undefined),
  );

  /** Event emitted when the sidebar has started closing. */
  @Output()
  readonly closedStart: Observable<void> = this._animationStarted.pipe(
    filter(() => !this.opened),
    mapTo(undefined),
  );

  private _focusTrap: FocusTrap;
  private _elementFocusedBeforeSidebarWasOpened: HTMLElement | null = null;
  private _eventCleanups: (() => void)[];

  private _mode: SbbSidebarMode = 'side';

  /** How the sidebar was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null;

  /** Event emitted when the sidebar open state is changed. */
  @Output() readonly openedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  /** Event emitted when the sidebar has been opened. */
  // tslint:disable-next-line:no-output-rename
  @Output('opened')
  readonly _openedStream: Observable<void> = this.openedChange.pipe(
    filter((o) => o),
    mapTo(undefined),
  );

  /** Event emitted when the sidebar has been closed. */
  // tslint:disable-next-line:no-output-rename
  @Output('closed')
  readonly _closedStream: Observable<void> = this.openedChange.pipe(
    filter((o) => !o),
    mapTo(undefined),
  );

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  /**
   * An observable that emits when the sidebar mode changes. This is used by the sidebar container to
   * to know when to when the mode changes so it can adapt the margins on the content.
   */
  readonly _modeChanged = new Subject<void>();

  readonly _svgIcon: Observable<string> = combineLatest([
    this._triggerSvgIconSubject,
    this.onPositionChanged.pipe(startWith(null)),
  ]).pipe(
    takeUntil(this._destroyed),
    map(([icon]) =>
      icon ? icon : this._position === 'start' ? 'hamburger-menu-small' : 'controls-small',
    ),
  );

  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _injector = inject(Injector);

  constructor(...args: unknown[]);
  constructor() {
    super();

    this.openedChange.pipe(takeUntil(this._destroyed)).subscribe((opened: boolean) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeSidebarWasOpened = this._doc.activeElement as HTMLElement;
        }
        this._takeFocus();
      } else if (this._isFocusWithinSidebar()) {
        this._restoreFocus(this._openedVia || 'program');
      }
    });

    this.onPositionChanged.pipe(takeUntil(this._destroyed));

    /**
     * Listen to `keydown` events outside the zone so that change detection is not run every
     * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed.
     * Additionally listen to router navigation start events to close the sidebar.
     */
    this._ngZone.runOutsideAngular(() => {
      const element = this._elementRef.nativeElement;
      merge(
        (fromEvent(element, 'keydown') as Observable<KeyboardEvent>).pipe(
          filter((event) => {
            return event.keyCode === ESCAPE && !hasModifierKey(event);
          }),
        ),
        this._router
          ? this._router.events.pipe(
              filter((e) => e instanceof NavigationStart),
              mapTo(null),
            )
          : NEVER,
      )
        .pipe(takeUntil(this._destroyed))
        .subscribe((event: KeyboardEvent | null) =>
          this._ngZone.run(() => {
            if (this.mode === 'side') {
              return;
            }
            this.close();
            if (!event) {
              return;
            }
            event.stopPropagation();
            event.preventDefault();
          }),
        );

      this._eventCleanups = [
        this._renderer.listen(element, 'transitionrun', this._handleTransitionEvent),
        this._renderer.listen(element, 'transitionend', this._handleTransitionEvent),
        this._renderer.listen(element, 'transitioncancel', this._handleTransitionEvent),
      ];
    });

    this._animationEnd.subscribe(() => {
      this.openedChange.emit(this._opened);
    });
  }

  /**
   * Moves focus into the sidebar. Note that this works even if
   * the focus trap is disabled in `side` mode.
   */
  private _takeFocus() {
    if (this.mode === 'side' || !this._focusTrap) {
      return;
    }

    const element = this._elementRef.nativeElement;

    afterNextRender(
      () => {
        const hasMovedFocus = this._focusTrap!.focusInitialElement();
        if (!hasMovedFocus && typeof element.focus === 'function') {
          element.focus();
        }
      },
      { injector: this._injector },
    );
  }

  /**
   * Restores focus to the element that was originally focused when the sidebar opened.
   * If no element was focused at that time, the focus will be restored to the sidebar.
   */
  private _restoreFocus(focusOrigin: Exclude<FocusOrigin, null>) {
    if (this.mode === 'side') {
      return;
    }

    if (this._elementFocusedBeforeSidebarWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeSidebarWasOpened, focusOrigin);
    } else {
      this._elementRef.nativeElement.blur();
    }

    this._elementFocusedBeforeSidebarWasOpened = null;
  }

  /** Whether focus is currently within the sidebar. */
  private _isFocusWithinSidebar(): boolean {
    const activeEl = this._doc?.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }

  ngAfterContentInit() {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    this._updateFocusTrapState();
  }

  override ngOnDestroy() {
    this._eventCleanups.forEach((cleanup) => cleanup());
    super.ngOnDestroy();
    if (this._focusTrap) {
      this._focusTrap.destroy();
    }

    this._animationStarted.complete();
    this._animationEnd.complete();
    this._modeChanged.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Open the sidebar.
   * @param openedVia Whether the sidebar was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidebar is closed.
   */
  open(openedVia?: FocusOrigin): Promise<SbbSidebarToggleResult> {
    return this.toggle(true, openedVia);
  }

  /** Close the sidebar. */
  close(): Promise<SbbSidebarToggleResult> {
    return this.toggle(false);
  }

  /** Closes the sidebar with context that the backdrop was clicked. */
  _closeViaBackdropClick(): Promise<SbbSidebarToggleResult> {
    // If the sidebar is closed upon a backdrop click, we always want to restore focus. We
    // don't need to check whether focus is currently in the sidebar, as clicking on the
    // backdrop causes blurs the active element.
    return this._setOpen(/* isOpen */ false, /* restoreFocus */ true, 'mouse');
  }

  /**
   * Toggle this sidebar.
   * @param isOpen Whether the sidebar should be open.
   * @param openedVia Whether the sidebar was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidebar is closed.
   */
  toggle(isOpen: boolean = !this.opened, openedVia?: FocusOrigin): Promise<SbbSidebarToggleResult> {
    // If the focus is currently inside the sidebar content and we are closing the sidebar,
    // restore the focus to the initially focused element (when the sidebar opened).
    if (isOpen && openedVia) {
      this._openedVia = openedVia;
    }

    const result = this._setOpen(
      isOpen,
      /* restoreFocus */ !isOpen && this._isFocusWithinSidebar(),
      this._openedVia || 'program',
    );

    if (!isOpen) {
      this._openedVia = null;
    }

    return result;
  }

  /**
   * Toggles the opened state of the sidebar.
   * @param isOpen Whether the sidebar should open or close.
   * @param restoreFocus Whether focus should be restored on close.
   * @param focusOrigin Origin to use when restoring focus.
   */
  private _setOpen(
    isOpen: boolean,
    restoreFocus: boolean,
    focusOrigin: Exclude<FocusOrigin, null>,
  ): Promise<SbbSidebarToggleResult> {
    if (isOpen === this._opened) {
      return Promise.resolve(isOpen ? 'open' : 'close');
    }

    this._opened = isOpen;

    if (this._container?._transitionsEnabled) {
      // Note: it's importatnt to set this as early as possible,
      // otherwise the animation can look glitchy in some cases.
      this._setIsAnimating(true);
    } else {
      // Simulate the animation events if animations are disabled.
      setTimeout(() => {
        this._animationStarted.next();
        this._animationEnd.next();
      });
    }

    this._elementRef.nativeElement.classList.toggle('sbb-sidebar-opened', isOpen);

    if (!isOpen && restoreFocus) {
      this._restoreFocus(focusOrigin);
    }

    // Needed to ensure that the closing sequence fires off correctly.
    this._changeDetectorRef.markForCheck();
    this._updateFocusTrapState();

    return new Promise<SbbSidebarToggleResult>((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? 'open' : 'close'));
    });
  }

  /** Toggles whether the drawer is currently animating. */
  private _setIsAnimating(isAnimating: boolean) {
    this._elementRef.nativeElement.classList.toggle('sbb-sidebar-animating', isAnimating);
  }

  _getWidth(): number {
    return this._elementRef.nativeElement.offsetWidth || 0;
  }

  /** Updates the enabled state of the focus trap. */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      // The focus trap is only enabled when the sidebar is open in any mode other than side.
      this._focusTrap.enabled = this.opened && this.mode !== 'side';
    }
  }

  _mobileChanged(mobile: boolean): void {
    this._mobile = mobile;
    Promise.resolve().then(() => {
      const wereTransitionsEnabled = this._container._transitionsEnabled;

      // temporary disabled animations when changing mode
      this._container._transitionsEnabled = false;
      this.mode = this.collapsible || mobile ? 'over' : 'side';

      if (!this._openedViaInput) {
        this.toggle(!mobile);
      } else {
        this._changeDetectorRef.markForCheck();
      }
      this._container._transitionsEnabled = wereTransitionsEnabled;
    });
  }

  /** Event handler for animation events. */
  private _handleTransitionEvent = (event: TransitionEvent) => {
    const element = this._elementRef.nativeElement;

    if (event.target === element) {
      this._ngZone.run(() => {
        if (event.type === 'transitionrun') {
          this._animationStarted.next(event);
        } else {
          // Don't toggle the animating state on `transitioncancel` since another animation should
          // start afterwards. This prevents the drawer from blinking if an animation is interrupted.
          if (event.type === 'transitionend') {
            this._setIsAnimating(false);
          }

          this._animationEnd.next(event);
        }
      });
    }
  };
}

@Component({
  selector: 'sbb-sidebar-container',
  exportAs: 'sbbSidebarContainer',
  templateUrl: './sidebar-container.html',
  styleUrls: ['./sidebar.css'],
  host: {
    class: 'sbb-sidebar-container',
    '[class.sbb-sidebar-container-mobile]': '_mobile',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SBB_SIDEBAR_CONTAINER,
      useExisting: SbbSidebarContainer,
    },
  ],
  imports: [SbbIcon, SbbSidebarContent, AsyncPipe],
})
export class SbbSidebarContainer
  extends SbbSidebarContainerBase<SbbSidebar>
  implements AfterContentInit, SbbSidebarMobileCapableContainer, OnDestroy
{
  private _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private _animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });

  _transitionsEnabled: boolean = false;
  _labelOpenSidebar: string = $localize`:Button label to open the sidebar@@sbbSidebarOpenSidebar:Open Sidebar`;

  /** The sidebar child at the start/end position. */
  override get start(): SbbSidebar | null {
    return this._start;
  }
  override get end(): SbbSidebar | null {
    return this._start;
  }

  /** Whether the sidebar container should have a backdrop while one of the sidebars is open. */
  get hasBackdrop() {
    return !this.start || this.start.mode !== 'side' || !this.end || this.end.mode !== 'side';
  }

  constructor(...args: unknown[]);
  constructor() {
    const platform = inject(Platform);
    const viewportRuler = inject(ViewportRuler);

    super();

    // Since the minimum width of the sidebar depends on the viewport width,
    // we need to recompute the margins if the viewport changes.
    viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateContentMargins());

    if (this._animationMode !== 'NoopAnimations' && platform.isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        // Enable the animations after a delay in order to skip
        // the initial transition if a sidebar is open by default.
        setTimeout(() => {
          this._element.nativeElement.classList.add('sbb-sidebar-transition');
          this._transitionsEnabled = true;
        }, 300);
      });
    }
  }

  /** All sidebars in the container. Includes sidebars from inside nested containers. */
  @ContentChildren(SbbSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  // We need an initializer here to avoid a TS error.
  override _allSidebars: QueryList<SbbSidebar> = undefined!;

  // We need an initializer here to avoid a TS error.
  @ContentChild(SbbSidebarContent) override _content: SbbSidebarContent = undefined!;
  @ViewChild(SbbSidebarContent) override _userContent: SbbSidebarContent = undefined!;

  /** Event emitted when the sidebar backdrop is clicked. */
  @Output() readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Margins to be applied to the content. These are used to shrink the sidebar content when a
   * sidebar is open. We use margin rather than transform because transform breaks
   * fixed position elements inside of the transformed element.
   */
  _contentMargins: { left: number | null; right: number | null } = { left: null, right: null };

  readonly _contentMarginChanges = new Subject<{ left: number | null }>();

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    this._sidebars.changes.pipe(startWith(null)).subscribe(() => {
      this._validateSidebars();

      this._sidebars.forEach((sidebar: SbbSidebar) => {
        this._watchSidebarToggle(sidebar);
        this._watchSidebarMode(sidebar);
        this._watchSidebarPosition(sidebar);
      });

      if (
        !this._sidebars.length ||
        this._isSidebarOpen(this._start) ||
        this._isSidebarOpen(this._end)
      ) {
        this.updateContentMargins();
      }

      this._changeDetectorRef.markForCheck();
    });

    // Has to be called at last (needs sidebar to be set)
    this._watchBreakpointObserver();
  }

  /** Calls `open` of both start and end sidebars */
  open(): void {
    this._sidebars.forEach((sidebar) => sidebar.open());
  }

  /** Calls `close` of both start and end sidebars */
  close(): void {
    this._sidebars.forEach((sidebar) => sidebar.close());
  }

  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    // 1. For sidebars in `over` mode, they don't affect the content.
    // 2. For sidebars in `side` mode they should shrink the content. We do this by adding to the
    //    left margin (for left sidebar).
    let left = 0;
    let right = 0;

    if (this._start && this._start.opened && this._start.mode === 'side') {
      left += this._start._getWidth();
    }

    if (this._end && this._end.opened && this._end.mode === 'side') {
      right += this._end._getWidth();
    }

    // If `left` is zero, don't set a style to the element. This
    // allows users to specify a custom size via CSS class in SSR scenarios where the
    // measured widths will always be zero. Note that we reset to `null` here, rather
    // than below, in order to ensure that the types in the `if` below are consistent.
    left = left || null!;
    right = right || null!;

    if (left !== this._contentMargins.left) {
      this._contentMargins = { left, right };

      // Pull back into the NgZone since in some cases we could be outside. We need to be careful
      // to do it only when something changed, otherwise we can end up hitting the zone too often.
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }

  /**
   * Subscribes to sidebar events in order to set a class on the main container element when the
   * sidebar is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  private _watchSidebarToggle(sidebar: SbbSidebar): void {
    sidebar._animationStarted.pipe(takeUntil(this._sidebars.changes)).subscribe(() => {
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });

    sidebar.openedChange
      .pipe(takeUntil(this._sidebars.changes))
      .subscribe(() => this._setContainerClass(sidebar.opened));
  }

  /** Subscribes to changes in sidebar mode so we can run change detection. */
  private _watchSidebarMode(sidebar: SbbSidebar): void {
    if (sidebar) {
      sidebar._modeChanged
        .pipe(takeUntil(merge(this._sidebars.changes, this._destroyed)))
        .subscribe(() => {
          this.updateContentMargins();
          this._changeDetectorRef.markForCheck();
        });
    }
  }

  /**
   * Subscribes to sidebar onPositionChanged event in order to
   * re-validate sidebars when the position changes.
   */
  private _watchSidebarPosition(sidebar: SbbSidebar) {
    if (!sidebar) {
      return;
    }

    sidebar.onPositionChanged.pipe(takeUntil(this._sidebars.changes)).subscribe(() => {
      this._validateSidebars();
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });
  }

  /** Toggles the 'sbb-sidebar-opened' class on the main 'sbb-sidebar-container' element. */
  private _setContainerClass(isAdd: boolean): void {
    const classList = this._element.nativeElement.classList;
    const className = 'sbb-sidebar-container-has-open';

    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }

  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalSidebarsViaBackdrop();
  }

  _closeModalSidebarsViaBackdrop() {
    // Close open sidebar where closing is not disabled and the mode is not `side`.
    [this._start, this._end]
      .filter((sidebar) => sidebar && this._canHaveBackdrop(sidebar))
      .forEach((sidebar) => sidebar!._closeViaBackdropClick());
  }

  _isShowingBackdrop(): boolean {
    return (
      (this._isSidebarOpen(this._start) && this._canHaveBackdrop(this._start)) ||
      (this._isSidebarOpen(this._end) && this._canHaveBackdrop(this._end))
    );
  }

  private _canHaveBackdrop(sidebar: SbbSidebar): boolean {
    return sidebar.mode !== 'side';
  }

  private _isSidebarOpen(sidebar: SbbSidebar | null): sidebar is SbbSidebar {
    return sidebar != null && sidebar.opened;
  }

  toggleSidebar(position: 'start' | 'end') {
    if (position === 'start') {
      this._start?.toggle();
    } else {
      this._end?.toggle();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._contentMarginChanges.complete();
  }
}
