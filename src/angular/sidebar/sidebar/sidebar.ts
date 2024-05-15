// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { AnimationEvent } from '@angular/animations';
import {
  ConfigurableFocusTrapFactory,
  FocusMonitor,
  FocusOrigin,
  FocusTrap,
} from '@angular/cdk/a11y';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  ANIMATION_MODULE_TYPE,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { BehaviorSubject, combineLatest, fromEvent, merge, NEVER, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  startWith,
  take,
  takeUntil,
} from 'rxjs/operators';

import {
  SbbSidebarBase,
  SbbSidebarContainerBase,
  SbbSidebarContentBase,
  SbbSidebarMobileCapableContainer,
  SBB_SIDEBAR_CONTAINER,
} from '../sidebar-base';

import { sbbSidebarAnimations } from './sidebar-animations';

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
  standalone: true,
})
export class SbbSidebarContent extends SbbSidebarContentBase implements AfterContentInit {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SbbSidebarContainer)) public _container: SbbSidebarContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone,
  ) {
    super(elementRef, scrollDispatcher, ngZone);
  }

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
  animations: [sbbSidebarAnimations.transformSidebar],
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
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CdkScrollable, SbbIcon],
})
export class SbbSidebar
  extends SbbSidebarBase
  implements AfterContentInit, AfterContentChecked, OnDestroy
{
  _labelCloseSidebar: string = $localize`:Button label to close the sidebar@@sbbSidebarCloseSidebar:Close Sidebar`;

  /** Whether the sidebar is in mobile mode. */
  _mobile: boolean = false;

  /** Whether the sidebar is initialized. Used for disabling the initial animation. */
  private _enableAnimations = false;

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

  /** Optional label to display in the header if sidebar is collapsible. */
  @Input() collapsibleHeaderLabel?: string | null;

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
   * Whether the sidebar is opened. We overload this because we trigger an event when it
   * starts or end.
   */
  get opened(): boolean {
    return this._opened;
  }

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
  get openedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState.indexOf('open') === 0),
      map(() => {}),
    );
  }

  /** Event emitted when the sidebar has started closing. */
  @Output()
  get closedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState === 'void'),
      map(() => {}),
    );
  }

  private _focusTrap: FocusTrap;
  private _elementFocusedBeforeSidebarWasOpened: HTMLElement | null = null;

  private _mode: SbbSidebarMode = 'side';
  private _opened: boolean = true;

  /** How the sidebar was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null;

  /** Emits whenever the sidebar has started animating. */
  readonly _animationStarted: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  /** Emits whenever the sidebar is done animating. */
  readonly _animationEnd: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  /** Current state of the sidebar animation. */
  // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
  // metadata is not inherited by child classes, instead the host binding data is defined in a way
  // that can be inherited.
  @HostBinding('@transform')
  _animationState: 'open-instant' | 'open' | 'void' = 'void';

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

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private _focusTrapFactory: ConfigurableFocusTrapFactory,
    private _focusMonitor: FocusMonitor,
    private _platform: Platform,
    private _ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) _doc: any,
    @Inject(SBB_SIDEBAR_CONTAINER) public override _container: SbbSidebarContainer,
    @Optional() private _router: Router,
  ) {
    super(_container, elementRef, _doc);

    this.openedChange.subscribe((opened: boolean) => {
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
      merge(
        (fromEvent(this._elementRef.nativeElement, 'keydown') as Observable<KeyboardEvent>).pipe(
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
    });

    // We need a Subject with distinctUntilChanged, because the `done` event
    // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
    this._animationEnd
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        }),
      )
      .subscribe((event: AnimationEvent) => {
        const { fromState, toState } = event;

        if (
          (toState.indexOf('open') === 0 && fromState === 'void') ||
          (toState === 'void' && fromState.indexOf('open') === 0)
        ) {
          this.openedChange.emit(this._opened);
        }
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

    this._focusTrap.focusInitialElementWhenReady().then((hasMovedFocus) => {
      // If there were no focusable elements, focus the sidebar itself so the keyboard navigation
      // still works. We need to check that `focus` is a function due to Universal.
      if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
        this._elementRef.nativeElement.focus();
      }
    });
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

  ngAfterContentChecked() {
    // Enable the animations after the lifecycle hooks have run, in order to avoid animating
    // sidebars that are open by default. When we're on the server, we shouldn't enable the
    // animations, because we don't want the sidebar to animate the first time the user sees
    // the page.
    if (this._platform.isBrowser) {
      this._enableAnimations = true;
    }
  }

  override ngOnDestroy() {
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
    this._opened = isOpen;

    if (isOpen) {
      this._animationState = this._enableAnimations ? 'open' : 'open-instant';
    } else {
      this._animationState = 'void';
      if (restoreFocus) {
        this._restoreFocus(focusOrigin);
      }
    }

    this._updateFocusTrapState();

    return new Promise<SbbSidebarToggleResult>((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? 'open' : 'close'));
    });
  }

  _getWidth(): number {
    return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
  }

  /** Updates the enabled state of the focus trap. */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      // The focus trap is only enabled when the sidebar is open in any mode other than side.
      this._focusTrap.enabled = this.opened && this.mode !== 'side';
    }
  }

  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  // tslint:disable-next-line:no-host-decorator-in-concrete
  @HostListener('@transform.start', ['$event'])
  _animationStartListener(event: AnimationEvent) {
    this._animationStarted.next(event);
  }

  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  // tslint:disable-next-line:no-host-decorator-in-concrete
  @HostListener('@transform.done', ['$event'])
  _animationDoneListener(event: AnimationEvent) {
    this._animationEnd.next(event);
  }

  _mobileChanged(mobile: boolean): void {
    this._mobile = mobile;
    Promise.resolve().then(() => {
      const wasAnimationsEnabled = this._enableAnimations;

      // temporary disabled animations when changing mode
      this._enableAnimations = false;
      this.mode = this.collapsible || mobile ? 'over' : 'side';

      if (mobile) {
        this.close();
      } else {
        this.open();
      }
      this._enableAnimations = wasAnimationsEnabled;
    });
  }
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
  standalone: true,
  imports: [SbbIcon, SbbSidebarContent, AsyncPipe],
})
export class SbbSidebarContainer
  extends SbbSidebarContainerBase<SbbSidebar>
  implements AfterContentInit, SbbSidebarMobileCapableContainer, OnDestroy
{
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

  constructor(
    private _element: ElementRef<HTMLElement>,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    breakPointObserver: BreakpointObserver,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string,
  ) {
    super(ngZone, changeDetectorRef, breakPointObserver);

    // Since the minimum width of the sidebar depends on the viewport width,
    // we need to recompute the margins if the viewport changes.
    viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateContentMargins());
  }

  /** All sidebars in the container. Includes sidebars from inside nested containers. */
  @ContentChildren(SbbSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  override _allSidebars: QueryList<SbbSidebar>;

  @ContentChild(SbbSidebarContent) override _content: SbbSidebarContent;
  @ViewChild(SbbSidebarContent) override _userContent: SbbSidebarContent;

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
    sidebar._animationStarted
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState),
        takeUntil(this._sidebars.changes),
      )
      .subscribe((event: AnimationEvent) => {
        // Set the transition class on the container so that the animations occur. This should not
        // be set initially because animations should only be triggered via a change in state.
        if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
          this._element.nativeElement.classList.add('sbb-sidebar-transition');
        }

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
