// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { AnimationEvent } from '@angular/animations';
import {
  ConfigurableFocusTrapFactory,
  FocusMonitor,
  FocusOrigin,
  FocusTrap,
} from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, ESCAPE, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkPortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Breakpoints } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { BehaviorSubject, fromEvent, merge, NEVER, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { SbbAppChooserSection } from './app-chooser-section';
import { sbbHeaderAnimations } from './header-animations';
import { SbbHeaderMenuTrigger } from './header-menu-trigger';
import { SBB_HEADER } from './header-token';

/** Result of the toggle promise that indicates the state of the header menu. */
export type SbbHeaderMenuToggleResult = 'open' | 'close';

export type SbbHeaderCollapseBreakpoint =
  | 'mobile'
  | 'tablet'
  | 'desktop'
  | 'desktopLarge'
  | 'desktop2k'
  | 'desktop4k'
  | 'desktop5k';

const breakpointMapping = {
  mobile: [Breakpoints.Mobile],
  tablet: [Breakpoints.Mobile, Breakpoints.Tablet],
  desktop: [Breakpoints.Mobile, Breakpoints.Tablet, Breakpoints.Desktop],
  desktopLarge: [
    Breakpoints.Mobile,
    Breakpoints.Tablet,
    Breakpoints.Desktop,
    Breakpoints.DesktopLarge,
  ],
  desktop2k: [
    Breakpoints.Mobile,
    Breakpoints.Tablet,
    Breakpoints.Desktop,
    Breakpoints.DesktopLarge,
    Breakpoints.Desktop2k,
  ],
  desktop4k: [
    Breakpoints.Mobile,
    Breakpoints.Tablet,
    Breakpoints.Desktop,
    Breakpoints.DesktopLarge,
    Breakpoints.Desktop2k,
    Breakpoints.Desktop4k,
  ],
  desktop5k: [
    Breakpoints.Mobile,
    Breakpoints.Tablet,
    Breakpoints.Desktop,
    Breakpoints.DesktopLarge,
    Breakpoints.Desktop2k,
    Breakpoints.Desktop4k,
    Breakpoints.Desktop5k,
  ],
};

@Component({
  selector: 'sbb-header-lean',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  exportAs: 'sbbHeader',
  animations: [sbbHeaderAnimations.menu],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: SBB_HEADER, useExisting: SbbHeaderLean }],
  host: {
    class: 'sbb-header-lean',
    '[class.sbb-header-lean-opened]': 'opened',
    '[class.sbb-header-lean-app-chooser-available]': '_appChooserSections.length',
  },
  imports: [SbbIconModule, CdkPortalOutlet, CdkPortal, AsyncPipe],
})
export class SbbHeaderLean implements OnChanges, AfterViewInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private _focusMonitor = inject(FocusMonitor);
  private _ngZone = inject(NgZone);
  private _breakpointObserver = inject(BreakpointObserver);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _router = inject(Router, { optional: true });
  private _doc = inject(DOCUMENT, { optional: true });

  _labelOpenMenu: string = $localize`:Button label to open the sidebar of the header@@sbbHeaderOpenMenu:Open Menu`;

  _labelCloseMenu: string = $localize`:Button label to close the sidebar of the header@@sbbHeaderCloseMenu:Close Menu`;

  /** Main title shown in the header. */
  @Input() label?: string;

  /** Subtitle shown below the main title, if present. */
  @Input() subtitle?: string;

  /**
   * The breakpoint on which to collapse the header menus into the burger menu.
   * Matching the given breakpoint or anything below, will collapse the menus.
   * (e.g. 'tablet' will collapse the menu, if 'tablet' or 'mobile' is matched)
   * See breakpoint documentation for specific values.
   */
  @Input() collapseBreakpoint: SbbHeaderCollapseBreakpoint = 'tablet';

  /** Whether the header menu is open. */
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: BooleanInput) {
    this.toggleMenu(coerceBooleanProperty(value));
  }
  private _opened = false;

  /** Emits whenever the header menu has started animating. */
  _animationStarted: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  /** Emits whenever the header menu is done animating. */
  _animationEnd: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  /** Current state of the menu animation. */
  _animationState: 'open' | 'void' = 'void';

  /** Observable of whether the menus are collapsed into the burger menu. */
  _headerMenusCollapsed: Observable<boolean>;

  /** Whether the menus are collapsed into the burger menu. */
  _menusCollapsed: boolean = false;

  /** Event emitted when the header menu open state is changed. */
  @Output() readonly openedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  /** Event emitted when the header menu has been opened. */
  @Output('opened')
  get _openedStream(): Observable<void> {
    return this.openedChange.pipe(
      filter((o) => o),
      map(() => {}),
    );
  }

  /** Event emitted when the header menu has started opening. */
  @Output()
  get openedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState.indexOf('open') === 0),
      map(() => {}),
    );
  }

  /** Event emitted when the header menu has been closed. */
  @Output('closed')
  get _closedStream(): Observable<void> {
    return this.openedChange.pipe(
      filter((o) => !o),
      map(() => {}),
    );
  }

  /** Event emitted when the header menu has started closing. */
  @Output()
  get closedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter((e) => e.fromState !== e.toState && e.toState === 'void'),
      map(() => {}),
    );
  }

  /** @docs-private */
  @ViewChild('menu', { static: true }) _menuElement: ElementRef<HTMLElement>;

  /**
   * The provided app chooser sections.
   * @docs-private
   */
  @ContentChildren(SbbAppChooserSection) _appChooserSections: QueryList<SbbAppChooserSection>;

  /**
   * Menu triggers used within the header.
   * @docs-private
   */
  @ContentChildren(SbbHeaderMenuTrigger) _menuTriggers: QueryList<SbbHeaderMenuTrigger>;

  /** How the sidenav was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null;

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  private readonly _collapseBreakpoint = new BehaviorSubject<SbbHeaderCollapseBreakpoint>(
    this.collapseBreakpoint,
  );

  private _focusTrap: FocusTrap;
  private _elementFocusedBeforeMenuWasOpened: HTMLElement | null = null;

  constructor(...args: unknown[]);
  constructor() {
    this.openedChange.subscribe((opened: boolean) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeMenuWasOpened = this._doc.activeElement as HTMLElement;
        }

        if (this.opened && this._focusTrap) {
          this._trapFocus();
        }
        if (this._doc && this.opened) {
          /**
           * Listen to `keydown` events outside the zone so that change detection is not run every
           * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed.
           */
          this._ngZone.runOutsideAngular(() => {
            merge(
              fromEvent<KeyboardEvent>(this._menuElement.nativeElement, 'keydown').pipe(
                filter((event) => event.keyCode === ESCAPE && !hasModifierKey(event)),
              ),
              this._router
                ? this._router.events.pipe(filter((e) => e instanceof NavigationStart))
                : NEVER,
            )
              .pipe(takeUntil(this.openedChange))
              .subscribe(() => this._ngZone.run(() => this.closeMenu()));
          });
        }
      } else {
        this._restoreFocus();
      }
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

    // Programmatically track the collapsed state of the header menus.
    // This is required in order to attach/detach the menus to the main
    // or side navigation.
    this._headerMenusCollapsed = this._collapseBreakpoint.pipe(
      switchMap((breakpoint) => this._breakpointObserver.observe(breakpointMapping[breakpoint])),
      map((r) => r.matches),
      distinctUntilChanged(),
      shareReplay(),
      takeUntil(this._destroyed),
    );

    // Close menus on collapsing/uncollapsing the header menus.
    merge(this.closedStart, this._headerMenusCollapsed).subscribe(() => {
      this._menuTriggers?.forEach((t) => t.closeMenu());
    });

    // Change property according to collapsed state.
    this._headerMenusCollapsed.subscribe((isCollapsed) => {
      Promise.resolve().then(() => (this._menusCollapsed = isCollapsed));
    });
    // Add or remove the sbb-header-lean-menus-collapsed css class, depending on
    // collapsed state.
    this._ngZone.runOutsideAngular(() => {
      this._headerMenusCollapsed.subscribe((isCollapsed) => {
        if (isCollapsed) {
          this._elementRef.nativeElement.classList.add('sbb-header-lean-menus-collapsed');
        } else {
          this._elementRef.nativeElement.classList.remove('sbb-header-lean-menus-collapsed');
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['collapseBreakpoint'] &&
      changes['collapseBreakpoint'].previousValue !== changes['collapseBreakpoint'].currentValue
    ) {
      this._collapseBreakpoint.next(this.collapseBreakpoint);
    }
  }

  ngAfterViewInit() {
    this._focusTrap = this._focusTrapFactory.create(this._menuElement.nativeElement);
    this._updateFocusTrapState();
  }

  ngOnDestroy() {
    if (this._focusTrap) {
      this._focusTrap.destroy();
    }

    this._animationStarted.complete();
    this._animationEnd.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** @docs-private */
  _openOnKeydownTrigger(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      this.openMenu('keyboard');
    }
  }

  /**
   * Open the header menu.
   * @param openedVia Whether the header menu was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  openMenu(openedVia?: FocusOrigin): Promise<SbbHeaderMenuToggleResult> {
    return this.toggleMenu(true, openedVia);
  }

  /** @docs-private */
  _closeOnKeydownTrigger(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      this.closeMenu();
    }
  }

  /** @docs-private */
  _onBackdropClicked() {
    this.closeMenu();
  }

  /** Close the header menu. */
  closeMenu(): Promise<SbbHeaderMenuToggleResult> {
    return this.toggleMenu(false);
  }

  /**
   * Toggle the header menu.
   * @param isOpen Whether the header menu should be open.
   * @param openedVia Whether the header menu was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  toggleMenu(
    isOpen: boolean = !this.opened,
    openedVia: FocusOrigin = 'program',
  ): Promise<SbbHeaderMenuToggleResult> {
    this._opened = isOpen;

    if (isOpen) {
      this._animationState = 'open';
      this._openedVia = openedVia;
    } else {
      this._animationState = 'void';
      this._changeDetectorRef.markForCheck();
      this._restoreFocus();
    }

    this._updateFocusTrapState();

    return new Promise<SbbHeaderMenuToggleResult>((resolve) => {
      this.openedChange.pipe(take(1)).subscribe((open) => resolve(open ? 'open' : 'close'));
    });
  }

  /** @docs-private */
  _animationStartListener(event: AnimationEvent) {
    this._animationStarted.next(event);
  }

  /** @docs-private */
  _animationDoneListener(event: AnimationEvent) {
    this._animationEnd.next(event);
  }

  /** Traps focus inside the header menu. */
  private _trapFocus() {
    this._focusTrap.focusInitialElementWhenReady().then((hasMovedFocus) => {
      // If there were no focusable elements, focus the sidenav itself so the keyboard navigation
      // still works. We need to check that `focus` is a function due to Universal.
      if (!hasMovedFocus && typeof this._menuElement.nativeElement.focus === 'function') {
        this._menuElement.nativeElement.focus();
      }
    });
  }

  /**
   * If focus is currently inside the header menu, restores it to where it was before
   * the header menu opened.
   */
  private _restoreFocus() {
    const activeEl = this._doc && this._doc.activeElement;

    if (activeEl && this._menuElement.nativeElement.contains(activeEl)) {
      if (this._elementFocusedBeforeMenuWasOpened instanceof HTMLElement) {
        this._focusMonitor.focusVia(this._elementFocusedBeforeMenuWasOpened, this._openedVia);
      } else {
        this._menuElement.nativeElement.blur();
      }
    }

    this._elementFocusedBeforeMenuWasOpened = null;
    this._openedVia = null;
  }

  /** Updates the enabled state of the focus trap. */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      this._focusTrap.enabled = this.opened;
    }
  }
}
