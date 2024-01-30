import { FocusMonitor, FocusOrigin, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { TypeRef } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { merge, NEVER, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SbbHeaderLean } from './header';
import type { SbbHeaderMenu } from './header-menu';
import { SBB_HEADER } from './header-token';

/** Injection token that determines the scroll handling while the menu is open. */
export const SBB_HEADER_MENU_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-header-menu-scroll-strategy',
);

/** @docs-private */
export function SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_HEADER_MENU_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY,
};

/** Options for binding a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

@Component({
  selector: 'button[sbbHeaderMenu]',
  templateUrl: './header-menu-trigger.html',
  styleUrls: ['./header-menu-trigger.css'],
  // We use the default change detection here, since it is unclear
  // whether OnPush works in all use cases.
  // TODO: Check if OnPush can be enabled.
  changeDetection: ChangeDetectionStrategy.Default,
  exportAs: 'sbbHeaderMenu',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-header-menu-trigger',
    type: 'button',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'this.menuOpen || null',
  },
  standalone: true,
  imports: [SbbIconModule],
})
export class SbbHeaderMenuTrigger implements AfterContentInit, OnDestroy {
  // Tracking input type is necessary so it's possible to only auto-focus
  // the first item of the list when the menu is opened via the keyboard
  _openedBy: 'mouse' | 'touch' | null = null;

  /** References the menu instance that the trigger is associated with. */
  @Input('sbbHeaderMenu')
  get menu() {
    return this._menu;
  }
  set menu(menu: SbbHeaderMenu) {
    if (menu === this._menu) {
      return;
    }

    this._menu = menu;
    this._menuCloseSubscription.unsubscribe();

    if (menu) {
      this._menuCloseSubscription = menu.closed.asObservable().subscribe(() => {
        this._destroyMenu();
      });
    }
  }
  private _menu: SbbHeaderMenu;

  /**
   * Whether focus should be restored when the menu is closed.
   * Note that disabling this option can have accessibility implications
   * and it's up to you to manage focus, if you decide to turn it off.
   */
  @Input('sbbHeaderMenuTriggerRestoreFocus') restoreFocus: boolean = true;

  /** Event emitted when the associated menu is opened. */
  @Output() readonly menuOpened: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the associated menu is closed. */
  @Output() readonly menuClosed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('panelTarget', { static: true }) _panelTarget: ElementRef<HTMLElement>;

  /** Whether the menu is open. */
  get menuOpen(): boolean {
    return this._menuOpen;
  }

  private _overlayRef: OverlayRef | null = null;
  private _menuOpen: boolean = false;
  private _closingActionsSubscription = Subscription.EMPTY;
  private _menuCloseSubscription = Subscription.EMPTY;
  private _destroyed = new Subject<void>();
  private _scrollStrategy: () => ScrollStrategy;

  /**
   * Handles touch start events on the trigger.
   * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
   */
  private _handleTouchStart = () => (this._openedBy = 'touch');

  constructor(
    private _overlay: Overlay,
    private _element: ElementRef<HTMLElement>,
    private _focusMonitor: FocusMonitor,
    @Optional() private _router: Router,
    @Inject(SBB_HEADER_MENU_SCROLL_STRATEGY) scrollStrategy: any,
    @Inject(SBB_HEADER) private _header: TypeRef<SbbHeaderLean>,
  ) {
    _element.nativeElement.addEventListener(
      'touchstart',
      this._handleTouchStart,
      passiveEventListenerOptions,
    );
    this._scrollStrategy = scrollStrategy;
  }

  ngAfterContentInit() {
    this._checkMenu();
  }

  ngOnDestroy() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }

    this._element.nativeElement.removeEventListener(
      'touchstart',
      this._handleTouchStart,
      passiveEventListenerOptions,
    );

    this._menuCloseSubscription.unsubscribe();
    this._closingActionsSubscription.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Toggles the menu between the open and closed states. */
  toggleMenu(): void {
    return this._menuOpen ? this.closeMenu() : this.openMenu();
  }

  /** Opens the menu. */
  openMenu(): void {
    if (this._menuOpen) {
      return;
    }

    this._checkMenu();
    if (this._header._menusCollapsed) {
      this.menu._panelPortalOutlet.attachTemplatePortal(this.menu._panelPortal);
    } else {
      const overlayRef = this._createOverlay();
      const overlayConfig = overlayRef.getConfig();

      this._setPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
      overlayConfig.hasBackdrop = true;
      overlayRef.attach(this.menu._panelPortal);
    }

    this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this.closeMenu());
    this._initMenu();
  }

  /** Closes the menu. */
  closeMenu(): void {
    if (this._menuOpen) {
      this._panelTarget.nativeElement.style.removeProperty('width');
      this.menu.open = false;
    }
  }

  /**
   * Focuses the menu trigger.
   * @param origin Source of the menu trigger's focus.
   */
  focus(origin: FocusOrigin = 'program', options?: FocusOptions) {
    if (this._focusMonitor) {
      this._focusMonitor.focusVia(this._element, origin, options);
    } else {
      this._element.nativeElement.focus(options);
    }
  }

  /** Handles mouse presses on the trigger. */
  @HostListener('mousedown', ['$event'])
  _handleMousedown(event: TypeRef<MouseEvent>): void {
    if (!isFakeMousedownFromScreenReader(event)) {
      // Since right or middle button clicks won't trigger the `click` event,
      // we shouldn't consider the menu as opened by mouse in those cases.
      this._openedBy = event.button === 0 ? 'mouse' : null;
    }
  }

  /** Handles click events on the trigger. */
  @HostListener('click')
  _handleClick(): void {
    this.toggleMenu();
  }

  /** Closes the menu and does the necessary cleanup. */
  private _destroyMenu() {
    if ((!this._overlayRef && !this.menu._panelPortalOutlet) || !this.menuOpen) {
      return;
    }

    this._closingActionsSubscription.unsubscribe();
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
    this.menu._panelPortalOutlet.detach();
    this._setIsMenuOpen(false);
    this._restoreFocus();
  }

  /**
   * This method sets the menu state to open and focuses the first item if
   * the menu was opened via the keyboard.
   */
  private _initMenu(): void {
    this.menu.open = true;
    this._setIsMenuOpen(true);

    // TODO: Figure out hot to properly handle click and keyboard variants.
    // this.menu.focusFirstItem(this._openedBy || 'program');
  }

  /** Restores focus to the element that was focused before the menu was open. */
  private _restoreFocus() {
    // We should reset focus if the user is navigating using a keyboard or
    // if we have a top-level trigger which might cause focus to be lost
    // when clicking on the backdrop.
    if (this.restoreFocus) {
      if (!this._openedBy) {
        // Note that the focus style will show up both for `program` and
        // `keyboard` so we don't have to specify which one it is.
        this.focus();
      } else {
        this.focus(this._openedBy);
      }
    }

    this._openedBy = null;
  }

  // set state rather than toggle to support triggers sharing a menu
  private _setIsMenuOpen(isOpen: boolean): void {
    this._menuOpen = isOpen;
    this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
  }

  /**
   * This method checks that a valid instance of HeaderMenu has been passed into
   * sbbHeaderMenu. If not, an exception is thrown.
   */
  private _checkMenu() {
    if (!this.menu) {
      throw Error(`sbbHeaderMenu: must pass in an sbb-header-menu instance.

      Example:
        <sbb-header-menu #menu="sbbHeaderMenu"></sbb-header-menu>
        <button [sbbHeaderMenu]="menu"></button>`);
    }
  }

  /**
   * This method creates the overlay from the provided menu's template and saves its
   * OverlayRef so that it can be attached to the DOM when openMenu is called.
   */
  private _createOverlay(): OverlayRef {
    if (!this._overlayRef) {
      const config = this._getOverlayConfig();
      this._overlayRef = this._overlay.create(config);

      // Consume the `keydownEvents` in order to prevent them from going to another overlay.
      // Ideally we'd also have our keyboard event logic in here, however doing so will
      // break anybody that may have implemented the `HeaderMenuPanel` themselves.
      this._overlayRef.keydownEvents().subscribe();
    }

    return this._overlayRef;
  }

  /**
   * This method builds the configuration object needed to create the overlay, the OverlayState.
   * @returns OverlayConfig
   */
  private _getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._panelTarget)
        .withFlexibleDimensions(false)
        .withGrowAfterOpen()
        .withLockedPosition()
        .withTransformOriginOn('.sbb-header-menu-panel'),
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this._scrollStrategy(),
      minWidth: this._getHostWidth(),
    });
  }

  /**
   * Sets the appropriate positions on a position strategy
   * so the overlay connects with the trigger correctly.
   * @param positionStrategy Strategy whose position to update.
   */
  private _setPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
    positionStrategy.withPositions([
      { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    ]);
  }

  /** Returns the width of the input element, so the panel width can match it. */
  protected _getHostWidth(): number {
    return this._element.nativeElement.getBoundingClientRect().width;
  }

  /** Returns a stream that emits whenever an action that should close the menu occurs. */
  private _menuClosingActions() {
    const backdrop = this._overlayRef ? this._overlayRef.backdropClick() : NEVER;
    const detachments = this._overlayRef ? this._overlayRef.detachments() : NEVER;
    const dimensionChange = this._header._headerMenusCollapsed;
    const routeChange = this._router
      ? this._router.events.pipe(filter((e) => e instanceof NavigationStart))
      : NEVER;
    const itemClicks = this.menu._items.toArray().map((i) => i.click);
    return merge(backdrop, detachments, dimensionChange, routeChange, ...itemClicks);
  }
}
