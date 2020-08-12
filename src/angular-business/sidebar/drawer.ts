import { AnimationEvent } from '@angular/animations';
import { FocusMonitor, FocusOrigin, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  take,
  takeUntil,
} from 'rxjs/operators';

import { sbbDrawerAnimations } from './drawer-animations';

/**
 * Throws an exception if more than one SbbDrawer is provided.
 * @docs-private
 */
export function throwSbbDuplicatedDrawerError() {
  throw Error(`Only one drawer at once is allowed'`);
}

/** Result of the toggle promise that indicates the state of the drawer. */
export type SbbDrawerToggleResult = 'open' | 'close';

/** Drawer and SideNav display modes. */
export type SbbDrawerMode = 'over' | 'push' | 'side';

/** Configures whether drawers should use auto sizing by default. */
export const SBB_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken<boolean>(
  'SBB_DRAWER_DEFAULT_AUTOSIZE',
  {
    providedIn: 'root',
    factory: SBB_DRAWER_DEFAULT_AUTOSIZE_FACTORY,
  }
);

/**
 * Used to provide a drawer container to a drawer while avoiding circular references.
 * @docs-private
 */
export const SBB_DRAWER_CONTAINER = new InjectionToken('SBB_DRAWER_CONTAINER');

/** @docs-private */
export function SBB_DRAWER_DEFAULT_AUTOSIZE_FACTORY(): boolean {
  return false;
}

@Component({
  selector: 'sbb-drawer-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-drawer-content',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbDrawerContent extends CdkScrollable implements AfterContentInit {
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SbbDrawerContainer)) public _container: SbbDrawerContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(elementRef, scrollDispatcher, ngZone);
  }

  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
}

/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
@Component({
  selector: 'sbb-drawer',
  exportAs: 'sbbDrawer',
  templateUrl: './drawer.html',
  animations: [sbbDrawerAnimations.transformDrawer],
  host: {
    class: 'sbb-drawer',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.sbb-drawer-over]': 'mode === "over"',
    '[class.sbb-drawer-push]': 'mode === "push"',
    '[class.sbb-drawer-side]': 'mode === "side"',
    '[class.sbb-drawer-opened]': 'opened',
    tabIndex: '-1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbDrawer implements AfterContentInit, AfterContentChecked, OnDestroy {
  /** Mode of the drawer; one of 'over', 'push' or 'side'. */
  @Input()
  get mode(): SbbDrawerMode {
    return this._mode;
  }
  set mode(value: SbbDrawerMode) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }

  /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
  @Input()
  get disableClose(): boolean {
    return this._disableClose;
  }
  set disableClose(value: boolean) {
    this._disableClose = coerceBooleanProperty(value);
  }

  /**
   * Whether the drawer should focus the first focusable element automatically when opened.
   * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
   * enabled, focus will be moved into the sidenav in `side` mode as well.
   */
  @Input()
  get autoFocus(): boolean {
    const value = this._autoFocus;

    // Note that usually we disable auto focusing in `side` mode, because we don't know how the
    // sidenav is being used, but in some cases it still makes sense to do it. If the consumer
    // explicitly enabled `autoFocus`, we take it as them always wanting to enable it.
    return value == null ? this.mode !== 'side' : value;
  }
  set autoFocus(value: boolean) {
    this._autoFocus = coerceBooleanProperty(value);
  }

  /**
   * Whether the drawer is opened. We overload this because we trigger an event when it
   * starts or end.
   */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    this.toggle(coerceBooleanProperty(value));
  }

  /** Event emitted when the drawer has started opening. */
  @Output()
  get openedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState.indexOf('open') === 0),
      map(() => {})
    );
  }

  /** Event emitted when the drawer has started closing. */
  @Output()
  get closedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState === 'void'),
      map(() => {})
    );
  }

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _focusTrapFactory: FocusTrapFactory,
    private _focusMonitor: FocusMonitor,
    private _platform: Platform,
    private _ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) private _doc: any,
    /**
     * @deprecated `_container` parameter to be made required.
     * @breaking-change 10.0.0
     */
    @Optional() @Inject(SBB_DRAWER_CONTAINER) public _container?: SbbDrawerContainer
  ) {
    this.openedChange.subscribe((opened: boolean) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement as HTMLElement;
        }

        this._takeFocus();
      } else if (this._isFocusWithinDrawer()) {
        this._restoreFocus();
      }
    });

    /**
     * Listen to `keydown` events outside the zone so that change detection is not run every
     * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed
     * and we don't have close disabled.
     */
    this._ngZone.runOutsideAngular(() => {
      (fromEvent(this._elementRef.nativeElement, 'keydown') as Observable<KeyboardEvent>)
        .pipe(
          filter((event) => {
            return event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event);
          }),
          takeUntil(this._destroyed)
        )
        .subscribe((event) =>
          this._ngZone.run(() => {
            this.close();
            event.stopPropagation();
            event.preventDefault();
          })
        );
    });

    // We need a Subject with distinctUntilChanged, because the `done` event
    // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
    this._animationEnd
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
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

  static ngAcceptInputType_disableClose: BooleanInput;
  static ngAcceptInputType_autoFocus: BooleanInput;
  static ngAcceptInputType_opened: BooleanInput;
  private _focusTrap: FocusTrap;
  private _elementFocusedBeforeDrawerWasOpened: HTMLElement | null = null;

  /** Whether the drawer is initialized. Used for disabling the initial animation. */
  private _enableAnimations = false;
  private _mode: SbbDrawerMode = 'over';
  private _disableClose: boolean = false;
  private _autoFocus: boolean | undefined;
  private _opened: boolean = false;

  /** How the sidenav was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null;

  /** Emits whenever the drawer has started animating. */
  _animationStarted = new Subject<AnimationEvent>();

  /** Emits whenever the drawer is done animating. */
  _animationEnd = new Subject<AnimationEvent>();

  /** Current state of the sidenav animation. */
  // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
  // metadata is not inherited by child classes, instead the host binding data is defined in a way
  // that can be inherited.
  // tslint:disable:no-host-decorator-in-concrete
  @HostBinding('@transform')
  _animationState: 'open-instant' | 'open' | 'void' = 'void';

  /** Event emitted when the drawer open state is changed. */
  @Output() readonly openedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  /** Event emitted when the drawer has been opened. */
  // tslint:disable-next-line:no-output-rename
  @Output('opened')
  _openedStream = this.openedChange.pipe(
    filter((o) => o),
    map(() => {})
  );

  /** Event emitted when the drawer has been closed. */
  // tslint:disable-next-line:no-output-rename
  @Output('closed')
  _closedStream = this.openedChange.pipe(
    filter((o) => !o),
    map(() => {})
  );

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  /**
   * An observable that emits when the drawer mode changes. This is used by the drawer container to
   * to know when to when the mode changes so it can adapt the margins on the content.
   */
  readonly _modeChanged = new Subject<void>();

  /**
   * Moves focus into the drawer. Note that this works even if
   * the focus trap is disabled in `side` mode.
   */
  private _takeFocus() {
    if (!this.autoFocus || !this._focusTrap) {
      return;
    }

    this._focusTrap.focusInitialElementWhenReady().then((hasMovedFocus) => {
      // If there were no focusable elements, focus the sidenav itself so the keyboard navigation
      // still works. We need to check that `focus` is a function due to Universal.
      if (!hasMovedFocus && typeof this._elementRef.nativeElement.focus === 'function') {
        this._elementRef.nativeElement.focus();
      }
    });
  }

  /**
   * Restores focus to the element that was originally focused when the drawer opened.
   * If no element was focused at that time, the focus will be restored to the drawer.
   */
  private _restoreFocus() {
    if (!this.autoFocus) {
      return;
    }

    // Note that we don't check via `instanceof HTMLElement` so that we can cover SVGs as well.
    if (this._elementFocusedBeforeDrawerWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, this._openedVia);
    } else {
      this._elementRef.nativeElement.blur();
    }

    this._elementFocusedBeforeDrawerWasOpened = null;
    this._openedVia = null;
  }

  /** Whether focus is currently within the drawer. */
  private _isFocusWithinDrawer(): boolean {
    const activeEl = this._doc?.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }

  ngAfterContentInit() {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
    this._updateFocusTrapState();
  }

  ngAfterContentChecked() {
    // Enable the animations after the lifecycle hooks have run, in order to avoid animating
    // drawers that are open by default. When we're on the server, we shouldn't enable the
    // animations, because we don't want the drawer to animate the first time the user sees
    // the page.
    if (this._platform.isBrowser) {
      this._enableAnimations = true;
    }
  }

  ngOnDestroy() {
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
   * Open the drawer.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  open(openedVia?: FocusOrigin): Promise<SbbDrawerToggleResult> {
    return this.toggle(true, openedVia);
  }

  /** Close the drawer. */
  close(): Promise<SbbDrawerToggleResult> {
    return this.toggle(false);
  }

  /** Closes the drawer with context that the backdrop was clicked. */
  _closeViaBackdropClick(): Promise<SbbDrawerToggleResult> {
    // If the drawer is closed upon a backdrop click, we always want to restore focus. We
    // don't need to check whether focus is currently in the drawer, as clicking on the
    // backdrop causes blurring of the active element.
    return this._setOpen(/* isOpen */ false, /* restoreFocus */ true);
  }

  /**
   * Toggle this drawer.
   * @param isOpen Whether the drawer should be open.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  toggle(isOpen: boolean = !this.opened, openedVia?: FocusOrigin): Promise<SbbDrawerToggleResult> {
    // If the focus is currently inside the drawer content and we are closing the drawer,
    // restore the focus to the initially focused element (when the drawer opened).
    return this._setOpen(
      isOpen,
      /* restoreFocus */ !isOpen && this._isFocusWithinDrawer(),
      openedVia
    );
  }

  /**
   * Toggles the opened state of the drawer.
   * @param isOpen Whether the drawer should open or close.
   * @param restoreFocus Whether focus should be restored on close.
   * @param openedVia Focus origin that can be optionally set when opening a drawer. The
   *   origin will be used later when focus is restored on drawer close.
   */
  private _setOpen(
    isOpen: boolean,
    restoreFocus: boolean,
    openedVia: FocusOrigin = 'program'
  ): Promise<SbbDrawerToggleResult> {
    this._opened = isOpen;

    if (isOpen) {
      this._animationState = this._enableAnimations ? 'open' : 'open-instant';
      this._openedVia = openedVia;
    } else {
      this._animationState = 'void';
      if (restoreFocus) {
        this._restoreFocus();
      }
    }

    this._updateFocusTrapState();

    return new Promise<SbbDrawerToggleResult>((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? 'open' : 'close'));
    });
  }

  _getWidth(): number {
    return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
  }

  /** Updates the enabled state of the focus trap. */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      // The focus trap is only enabled when the drawer is open in any mode other than side.
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
}

/**
 * `<sbb-drawer-container>` component.
 *
 * This is the parent component to one or two `<sbb-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
@Component({
  selector: 'sbb-drawer-container',
  exportAs: 'sbbDrawerContainer',
  templateUrl: './drawer-container.html',
  styleUrls: ['./drawer.css'],
  host: {
    class: 'sbb-drawer-container',
    '[class.sbb-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SBB_DRAWER_CONTAINER,
      useExisting: SbbDrawerContainer,
    },
  ],
})
export class SbbDrawerContainer implements AfterContentInit, DoCheck, OnDestroy {
  /** The drawer child */
  get drawer(): SbbDrawer | null {
    return this._drawer;
  }

  /**
   * Whether to automatically resize the container whenever
   * the size of any of its drawers changes.
   *
   * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
   * the drawers on every change detection cycle. Can be configured globally via the
   * `SBB_DRAWER_DEFAULT_AUTOSIZE` token.
   */
  @Input()
  get autosize(): boolean {
    return this._autosize;
  }
  set autosize(value: boolean) {
    this._autosize = coerceBooleanProperty(value);
  }

  /**
   * Whether the drawer container should have a backdrop while one of the sidenavs is open.
   * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
   * mode as well.
   */
  @Input()
  get hasBackdrop() {
    if (this._backdropOverride == null) {
      return !this._drawer || this._drawer.mode !== 'side';
    }

    return this._backdropOverride;
  }
  set hasBackdrop(value: any) {
    this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
  }

  /** Reference to the CdkScrollable instance that wraps the scrollable content. */
  get scrollable(): CdkScrollable {
    return this._userContent || this._content;
  }

  constructor(
    private _element: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    private _changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Inject(SBB_DRAWER_DEFAULT_AUTOSIZE) defaultAutosize = false,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    // Since the minimum width of the sidenav depends on the viewport width,
    // we need to recompute the margins if the viewport changes.
    viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateContentMargins());

    this._autosize = defaultAutosize;
  }

  static ngAcceptInputType_autosize: BooleanInput;
  static ngAcceptInputType_hasBackdrop: BooleanInput;
  /** All drawers in the container. Includes drawers from inside nested containers. */
  @ContentChildren(SbbDrawer, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allDrawers: QueryList<SbbDrawer>;

  /** Drawers that belong to this container. */
  _drawers = new QueryList<SbbDrawer>();

  @ContentChild(SbbDrawerContent) _content: SbbDrawerContent;
  @ViewChild(SbbDrawerContent) _userContent: SbbDrawerContent;
  private _autosize: boolean;
  _backdropOverride: boolean | null;

  /** Event emitted when the drawer backdrop is clicked. */
  @Output() readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  /** The drawer */
  private _drawer: SbbDrawer | null;

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  /** Emits on every ngDoCheck. Used for debouncing reflows. */
  private readonly _doCheckSubject = new Subject<void>();

  /**
   * Margins to be applied to the content. These are used to push / shrink the drawer content when a
   * drawer is open. We use margin rather than transform even for push mode because transform breaks
   * fixed position elements inside of the transformed element.
   */
  _contentMargins: { left: number | null; right: number | null } = { left: null, right: null };

  readonly _contentMarginChanges = new Subject<{ left: number | null; right: number | null }>();

  ngAfterContentInit() {
    this._allDrawers.changes
      .pipe(startWith(this._allDrawers), takeUntil(this._destroyed))
      .subscribe((drawer: QueryList<SbbDrawer>) => {
        // @breaking-change 10.0.0 Remove `_container` check once container parameter is required.
        this._drawers.reset(drawer.filter((item) => !item._container || item._container === this));
        this._drawers.notifyOnChanges();
      });

    this._drawers.changes.pipe(startWith(null)).subscribe(() => {
      this._validateDrawers();

      this._drawers.forEach((drawer: SbbDrawer) => {
        this._watchDrawerToggle(drawer);
        this._watchDrawerMode(drawer);
      });

      if (!this._drawers.length || this._isDrawerOpen(this._drawer)) {
        this.updateContentMargins();
      }

      this._changeDetectorRef.markForCheck();
    });

    // Avoid hitting the NgZone through the debounce timeout.
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject
        .pipe(
          debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
          takeUntil(this._destroyed)
        )
        .subscribe(() => this.updateContentMargins());
    });
  }

  ngOnDestroy() {
    this._contentMarginChanges.complete();
    this._doCheckSubject.complete();
    this._drawers.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Calls `open` of the drawer */
  open(): void {
    this._drawer?.open();
  }

  /** Calls `close` of the drawer */
  close(): void {
    this._drawer?.close();
  }

  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    // 1. For drawers in `over` mode, they don't affect the content.
    // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
    //    left margin (for left drawer) or right margin (for right the drawer).
    // 3. For drawers in `push` mode the should shift the content without resizing it. We do this by
    //    adding to the left or right margin and simultaneously subtracting the same amount of
    //    margin from the other side.
    let left = 0;
    let right = 0;

    if (this._drawer && this._drawer.opened) {
      if (this._drawer.mode === 'side') {
        left += this._drawer._getWidth();
      } else if (this._drawer.mode === 'push') {
        const width = this._drawer._getWidth();
        left += width;
        right -= width;
      }
    }

    // If either `right` or `left` is zero, don't set a style to the element. This
    // allows users to specify a custom size via CSS class in SSR scenarios where the
    // measured widths will always be zero. Note that we reset to `null` here, rather
    // than below, in order to ensure that the types in the `if` below are consistent.
    left = left || null!;
    right = right || null!;

    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = { left, right };

      // Pull back into the NgZone since in some cases we could be outside. We need to be careful
      // to do it only when something changed, otherwise we can end up hitting the zone too often.
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }

  ngDoCheck() {
    // If users opted into autosizing, do a check every change detection cycle.
    if (this._autosize && this._isPushed()) {
      // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }

  /**
   * Subscribes to drawer events in order to set a class on the main container element when the
   * drawer is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  private _watchDrawerToggle(drawer: SbbDrawer): void {
    drawer._animationStarted
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState),
        takeUntil(this._drawers.changes)
      )
      .subscribe((event: AnimationEvent) => {
        // Set the transition class on the container so that the animations occur. This should not
        // be set initially because animations should only be triggered via a change in state.
        if (event.toState !== 'open-instant' && this._animationMode !== 'NoopAnimations') {
          this._element.nativeElement.classList.add('sbb-drawer-transition');
        }

        this.updateContentMargins();
        this._changeDetectorRef.markForCheck();
      });

    if (drawer.mode !== 'side') {
      drawer.openedChange
        .pipe(takeUntil(this._drawers.changes))
        .subscribe(() => this._setContainerClass(drawer.opened));
    }
  }

  /** Subscribes to changes in drawer mode so we can run change detection. */
  private _watchDrawerMode(drawer: SbbDrawer): void {
    if (drawer) {
      drawer._modeChanged
        .pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
        .subscribe(() => {
          this.updateContentMargins();
          this._changeDetectorRef.markForCheck();
        });
    }
  }

  /** Toggles the 'sbb-drawer-opened' class on the main 'sbb-drawer-container' element. */
  private _setContainerClass(isAdd: boolean): void {
    const classList = this._element.nativeElement.classList;
    const className = 'sbb-drawer-container-has-open';

    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }

  /** Validate the state of the drawer children components. */
  private _validateDrawers() {
    this._drawer = null;

    // Ensure that we have at most one drawer.
    if (this._drawers.length > 1) {
      throwSbbDuplicatedDrawerError();
    }
    this._drawer = this._drawers.first;
  }

  /** Whether the container is being pushed to the side by one of the drawers. */
  private _isPushed() {
    return this._isDrawerOpen(this._drawer) && this._drawer.mode !== 'over';
  }

  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalDrawersViaBackdrop();
  }

  _closeModalDrawersViaBackdrop() {
    // Close open drawer where closing is not disabled and the mode is not `side`.
    if (this._drawer && !this._drawer.disableClose && this._canHaveBackdrop(this._drawer)) {
      this._drawer!._closeViaBackdropClick();
    }
  }

  _isShowingBackdrop(): boolean {
    return this._isDrawerOpen(this._drawer) && this._canHaveBackdrop(this._drawer);
  }

  private _canHaveBackdrop(drawer: SbbDrawer): boolean {
    return drawer.mode !== 'side' || !!this._backdropOverride;
  }

  private _isDrawerOpen(drawer: SbbDrawer | null): drawer is SbbDrawer {
    return drawer != null && drawer.opened;
  }
}
