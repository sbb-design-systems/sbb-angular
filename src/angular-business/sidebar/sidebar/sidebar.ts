import { AnimationEvent } from '@angular/animations';
import { FocusMonitor, FocusOrigin, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
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
import { distinctUntilChanged, filter, map, startWith, take, takeUntil } from 'rxjs/operators';

import {
  ISbbSidebarContainer,
  SbbSidebarBase,
  SbbSidebarContainerBase,
  SbbSidebarContentBase,
  SBB_SIDEBAR_CONTAINER,
} from '../sidebar-base';

import { sbbSidebarAnimations } from './sidebar-animations';

/** Result of the toggle promise that indicates the state of the sidebar. */
export type SbbSidebarToggleResult = 'open' | 'close';

/** Sidebar display modes. */
export type SbbSidebarMode = 'over' | 'push' | 'side';

/** Configures whether sidebars should use auto sizing by default. */
export const SBB_SIDEBAR_DEFAULT_AUTOSIZE = new InjectionToken<boolean>(
  'SBB_SIDEBAR_DEFAULT_AUTOSIZE',
  {
    providedIn: 'root',
    factory: SBB_SIDEBAR_DEFAULT_AUTOSIZE_FACTORY,
  }
);

/** @docs-private */
export function SBB_SIDEBAR_DEFAULT_AUTOSIZE_FACTORY(): boolean {
  return false;
}

@Component({
  selector: 'sbb-sidebar-content',
  template: '<ng-content></ng-content>',
  host: {
    class: 'sbb-sidebar-content sbb-sidebar-content sbb-scrollbar',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbSidebarContent extends SbbSidebarContentBase {
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    @Inject(forwardRef(() => SbbSidebarContainer)) public _container: SbbSidebarContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(changeDetectorRef, _container, elementRef, scrollDispatcher, ngZone);
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
    '[class.sbb-sidebar-push]': 'mode === "push"',
    '[class.sbb-sidebar-side]': 'mode === "side"',
    '[class.sbb-sidebar-opened]': 'opened',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbSidebar extends SbbSidebarBase
  implements AfterContentInit, AfterContentChecked, OnDestroy {
  /** Mode of the sidebar; one of 'over', 'push' or 'side'. */
  @Input()
  get mode(): SbbSidebarMode {
    return this._mode;
  }
  set mode(value: SbbSidebarMode) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }

  /**
   * Whether the sidebar should focus the first focusable element automatically when opened.
   * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
   * enabled, focus will be moved into the sidebar in `side` mode as well.
   */
  @Input()
  get autoFocus(): boolean {
    const value = this._autoFocus;

    // Note that usually we disable auto focusing in `side` mode, because we don't know how the
    // sidebar is being used, but in some cases it still makes sense to do it. If the consumer
    // explicitly enabled `autoFocus`, we take it as them always wanting to enable it.
    return value == null ? this.mode !== 'side' : value;
  }
  set autoFocus(value: boolean) {
    this._autoFocus = coerceBooleanProperty(value);
  }

  /**
   * Whether the sidebar is opened. We overload this because we trigger an event when it
   * starts or end.
   */
  @Input()
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    this.toggle(coerceBooleanProperty(value));
  }

  /** Whether the sidebar can be closed with the escape key or by clicking on the backdrop. */
  @Input()
  get disableClose(): boolean {
    return this._disableClose;
  }
  set disableClose(value: boolean) {
    this._disableClose = coerceBooleanProperty(value);
  }

  /** Event emitted when the sidebar has started opening. */
  @Output()
  get openedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState.indexOf('open') === 0),
      map(() => {})
    );
  }

  /** Event emitted when the sidebar has started closing. */
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
    platform: Platform,
    private _ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) private _doc: any,
    @Inject(SBB_SIDEBAR_CONTAINER) public _container: SbbSidebarContainer
  ) {
    super(platform, _container);

    this.openedChange.subscribe((opened: boolean) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeSidebarWasOpened = this._doc.activeElement as HTMLElement;
        }

        this._takeFocus();
      } else if (this._isFocusWithinSidebar()) {
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

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  private _focusTrap: FocusTrap;

  private _elementFocusedBeforeSidebarWasOpened: HTMLElement | null = null;

  private _mode: SbbSidebarMode = 'over';
  private _disableClose: boolean = false;
  private _autoFocus: boolean | undefined;
  private _opened: boolean = false;

  /** How the sidebar was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null;

  /** Emits whenever the sidebar has started animating. */
  _animationStarted = new Subject<AnimationEvent>();

  /** Emits whenever the sidebar is done animating. */
  _animationEnd = new Subject<AnimationEvent>();

  /** Current state of the sidebar animation. */
  // @HostBinding is used in the class as it is expected to be extended.  Since @Component decorator
  // metadata is not inherited by child classes, instead the host binding data is defined in a way
  // that can be inherited.
  // tslint:disable:no-host-decorator-in-concrete
  @HostBinding('@transform')
  _animationState: 'open-instant' | 'open' | 'void' = 'void';

  /** Event emitted when the sidebar open state is changed. */
  @Output() readonly openedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  /** Event emitted when the sidebar has been opened. */
  // tslint:disable-next-line:no-output-rename
  @Output('opened')
  _openedStream = this.openedChange.pipe(
    filter((o) => o),
    map(() => {})
  );

  /** Event emitted when the sidebar has been closed. */
  // tslint:disable-next-line:no-output-rename
  @Output('closed')
  _closedStream = this.openedChange.pipe(
    filter((o) => !o),
    map(() => {})
  );

  /**
   * An observable that emits when the sidebar mode changes. This is used by the sidebar container to
   * to know when to when the mode changes so it can adapt the margins on the content.
   */
  readonly _modeChanged = new Subject<void>();

  _getWidth(): number {
    return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
  }

  /**
   * Moves focus into the sidebar. Note that this works even if
   * the focus trap is disabled in `side` mode.
   */
  private _takeFocus() {
    if (!this.autoFocus || !this._focusTrap) {
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
  private _restoreFocus() {
    if (!this.autoFocus) {
      return;
    }

    // Note that we don't check via `instanceof HTMLElement` so that we can cover SVGs as well.
    if (this._elementFocusedBeforeSidebarWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeSidebarWasOpened, this._openedVia);
    } else {
      this._elementRef.nativeElement.blur();
    }

    this._elementFocusedBeforeSidebarWasOpened = null;
    this._openedVia = null;
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
    // backdrop causes blurring of the active element.
    return this._setOpen(/* isOpen */ false, /* restoreFocus */ true);
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
    return this._setOpen(
      isOpen,
      /* restoreFocus */ !isOpen && this._isFocusWithinSidebar(),
      openedVia
    );
  }

  /**
   * Toggles the opened state of the sidebar.
   * @param isOpen Whether the sidebar should open or close.
   * @param restoreFocus Whether focus should be restored on close.
   * @param openedVia Focus origin that can be optionally set when opening a sidebar. The
   *   origin will be used later when focus is restored on sidebar close.
   */
  private _setOpen(
    isOpen: boolean,
    restoreFocus: boolean,
    openedVia: FocusOrigin = 'program'
  ): Promise<SbbSidebarToggleResult> {
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

    return new Promise<SbbSidebarToggleResult>((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? 'open' : 'close'));
    });
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

  _mobileChanged(mobile: boolean): void {}
}

@Component({
  selector: 'sbb-sidebar-container',
  exportAs: 'sbbSidebarContainer',
  templateUrl: './sidebar-container.html',
  styleUrls: ['./sidebar.css'],
  host: {
    class: 'sbb-sidebar-container sbb-sidebar-container',
    '[class.sbb-sidebar-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: SBB_SIDEBAR_CONTAINER,
      useExisting: SbbSidebarContainer,
    },
  ],
})
export class SbbSidebarContainer extends SbbSidebarContainerBase<SbbSidebar>
  implements DoCheck, AfterContentInit, ISbbSidebarContainer {
  static ngAcceptInputType_hasBackdrop: BooleanInput;
  static ngAcceptInputType_autosize: BooleanInput;

  @ContentChildren(SbbSidebar, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allSidebars: QueryList<SbbSidebar>;

  @ContentChild(SbbSidebarContent) _content: SbbSidebarContent;
  @ViewChild(SbbSidebarContent) _userContent: SbbSidebarContent;

  /**
   * Margins to be applied to the content. These are used to push / shrink the sidebar content when a
   * sidebar is open. We use margin rather than transform even for push mode because transform breaks
   * fixed position elements inside of the transformed element.
   */
  _contentMargins: { left: number | null; right: number | null } = { left: null, right: null };

  readonly _contentMarginChanges = new Subject<{ left: number | null; right: number | null }>();

  /** The sidebar child */
  get sidebar(): SbbSidebar | null {
    return this._sidebar;
  }

  /** The sidebar */
  protected _sidebar: SbbSidebar | null;

  /**
   * Whether to automatically resize the container whenever
   * the size of any of its sidebars changes.
   *
   * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
   * the sidebars on every change detection cycle. Can be configured globally via the
   * `SBB_SIDEBAR_DEFAULT_AUTOSIZE` token.
   */
  @Input()
  get autosize(): boolean {
    return this._autosize;
  }
  set autosize(value: boolean) {
    this._autosize = coerceBooleanProperty(value);
  }

  /**
   * Whether the sidebar container should have a backdrop while one of the sidebars is open.
   * If explicitly set to `true`, the backdrop will be enabled for sidebars in the `side`
   * mode as well.
   */
  @Input()
  get hasBackdrop() {
    if (this._backdropOverride == null) {
      return !this.sidebar || this.sidebar.mode !== 'side';
    }

    return this._backdropOverride;
  }
  set hasBackdrop(value: any) {
    this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
  }

  constructor(
    private _element: ElementRef<HTMLElement>,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Inject(SBB_SIDEBAR_DEFAULT_AUTOSIZE) defaultAutosize = false,
    breakPointObserver: BreakpointObserver,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    super(ngZone, changeDetectorRef, breakPointObserver, viewportRuler);

    this._autosize = defaultAutosize;
  }

  private _autosize: boolean;
  _backdropOverride: boolean | null;

  /** Event emitted when the sidebar backdrop is clicked. */
  @Output() readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this._sidebars.changes.pipe(startWith(null)).subscribe(() => {
      this._validateSidebars();

      this._sidebars.forEach((sidebar: SbbSidebar) => {
        this._watchSidebarToggle(sidebar);
        this._watchSidebarMode(sidebar);
      });

      if (!this._sidebars.length || this._isSidebarOpen(this._sidebar)) {
        this.updateContentMargins();
      }

      this._changeDetectorRef.markForCheck();
    });
  }

  /** Calls `open` of the sidebar */
  open(): void {
    this.sidebar?.open();
  }

  /** Calls `close` of the sidebar */
  close(): void {
    this.sidebar?.close();
  }

  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    // 1. For sidebars in `over` mode, they don't affect the content.
    // 2. For sidebars in `side` mode they should shrink the content. We do this by adding to the
    //    left margin (for left sidebar) or right margin (for right the sidebar).
    // 3. For sidebars in `push` mode the should shift the content without resizing it. We do this by
    //    adding to the left or right margin and simultaneously subtracting the same amount of
    //    margin from the other side.
    let left = 0;
    let right = 0;

    if (this._sidebar && this._sidebar.opened) {
      if (this._sidebar.mode === 'side') {
        left += this._sidebar._getWidth();
      } else if (this._sidebar.mode === 'push') {
        const width = this._sidebar._getWidth();
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

  /**
   * Subscribes to sidebar events in order to set a class on the main container element when the
   * sidebar is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  private _watchSidebarToggle(sidebar: SbbSidebar): void {
    sidebar._animationStarted
      .pipe(
        filter((event: AnimationEvent) => event.fromState !== event.toState),
        takeUntil(this._sidebars.changes)
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

    if (sidebar.mode !== 'side') {
      sidebar.openedChange
        .pipe(takeUntil(this._sidebars.changes))
        .subscribe(() => this._setContainerClass(sidebar.opened));
    }
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

  /** Whether the container is being pushed to the side by one of the sidebars. */
  private _isPushed() {
    return this._isSidebarOpen(this._sidebar) && this._sidebar.mode !== 'over';
  }

  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalSidebarsViaBackdrop();
  }

  _closeModalSidebarsViaBackdrop() {
    // Close open sidebar where closing is not disabled and the mode is not `side`.
    if (this._sidebar && !this._sidebar.disableClose && this._canHaveBackdrop(this._sidebar)) {
      this._sidebar!._closeViaBackdropClick();
    }
  }

  _isShowingBackdrop(): boolean {
    return this._isSidebarOpen(this._sidebar) && this._canHaveBackdrop(this._sidebar);
  }

  private _canHaveBackdrop(sidebar: SbbSidebar): boolean {
    return sidebar.mode !== 'side' || !!this._backdropOverride;
  }

  private _isSidebarOpen(sidebar: SbbSidebar | null): sidebar is SbbSidebar {
    return sidebar != null && sidebar.opened;
  }

  ngDoCheck() {
    // If users opted into autosizing, do a check every change detection cycle.
    if (this._autosize && this._isPushed()) {
      // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }
}
