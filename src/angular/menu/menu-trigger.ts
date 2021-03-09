import { FocusMonitor, FocusOrigin, isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { coerceStringArray } from '@angular/cdk/coercion';
import { ENTER, RIGHT_ARROW, SPACE } from '@angular/cdk/keycodes';
import {
  FlexibleConnectedPositionStrategy,
  HorizontalConnectionPos,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
  VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { HasVariantCtor, mixinVariant } from '@sbb-esta/angular/core';
import { asapScheduler, merge, of as observableOf, Subscription } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { SbbMenu, SbbMenuCloseReason } from './menu';
import { throwSbbMenuMissingError, throwSbbMenuRecursiveError } from './menu-errors';
import { SbbMenuItem } from './menu-item';
import { SbbMenuPanel, SBB_MENU_PANEL } from './menu-panel';
import { SbbMenuPositionX, SbbMenuPositionY } from './menu-positions';

/** Injection token that determines the scroll handling while the menu is open. */
export const SBB_MENU_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-menu-scroll-strategy'
);

/** @docs-private */
export function SBB_MENU_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_MENU_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_MENU_SCROLL_STRATEGY_FACTORY,
};

/** Default top padding of the menu panel. */
export const MENU_PANEL_TOP_PADDING = 0;

/** Default left overlapping of the submenu panel. */
export const SUBMENU_PANEL_LEFT_OVERLAP = 3;

/** Options for binding a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });

// Boilerplate for applying mixins to SbbMenu.
/** @docs-private */
class SbbMenuTriggerBase {}
// tslint:disable-next-line: naming-convention
const _SbbMenuTriggerMixinBase: HasVariantCtor & typeof SbbMenuTriggerBase = mixinVariant(
  SbbMenuTriggerBase
);

/** Directive applied to an element that should trigger a `sbb-menu`. */
@Directive({
  selector: `[sbbMenuTriggerFor], [sbbMenuCustomTriggerFor]`,
  host: {
    class: 'sbb-menu-trigger',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'menuOpen || null',
    '[attr.aria-controls]': 'menuOpen ? menu.panelId : null',
    '[class.sbb-menu-trigger-standard]': 'this._triggerVariant === ""',
    '[class.sbb-menu-trigger-custom]': 'this._triggerVariant === "custom"',
    '[class.sbb-menu-trigger-open]': 'menuOpen',
    '[class.sbb-menu-trigger-root]': '!_parentSbbMenu',
  },
  exportAs: 'sbbMenuTrigger',
})
export class SbbMenuTrigger
  extends _SbbMenuTriggerMixinBase
  implements AfterContentInit, OnDestroy {
  private _portal: TemplatePortal;
  private _overlayRef: OverlayRef | null = null;
  private _menuOpen: boolean = false;
  private _closingActionsSubscription = Subscription.EMPTY;
  private _hoverSubscription = Subscription.EMPTY;
  private _menuCloseSubscription = Subscription.EMPTY;
  private _scrollStrategy: () => ScrollStrategy;

  /**
   * We're specifically looking for a `SbbMenu` here since the generic `SbbMenuPanel`
   * interface lacks some functionality around nested menus and animations.
   */
  _parentSbbMenu: SbbMenu | undefined;

  /**
   * Handles touch start events on the trigger.
   * Needs to be an arrow function so we can easily use addEventListener and removeEventListener.
   */
  private _handleTouchStart = (event: TouchEvent) => {
    // if (!isFakeTouchstartFromScreenReader(event)) { TODO: activate with next cdk release
    this._openedBy = 'touch';
    // }
  };

  // Tracking input type is necessary so it's possible to only auto-focus
  // the first item of the list when the menu is opened via the keyboard
  _openedBy: Exclude<FocusOrigin, 'program' | null> | undefined = undefined;

  /** Variant of which trigger is used. */
  _triggerVariant: string = '';

  /** References the menu instance that the custom trigger is associated with. */
  @Input('sbbMenuCustomTriggerFor')
  set sbbMenuCustomTriggerFor(v: SbbMenuPanel) {
    this._triggerVariant = 'custom';
    this.menu = v;
  }

  /** References the menu instance that the trigger is associated with. */
  @Input('sbbMenuTriggerFor')
  get menu() {
    return this._menu;
  }
  set menu(menu: SbbMenuPanel) {
    if (menu === this._menu) {
      return;
    }

    this._menu = menu;
    this._menuCloseSubscription.unsubscribe();

    if (menu) {
      if (menu === this._parentSbbMenu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        throwSbbMenuRecursiveError();
      }

      this._menuCloseSubscription = menu.closed.subscribe((reason: SbbMenuCloseReason) => {
        this._destroyMenu(reason);

        // If a click closed the menu, we should close the entire chain of nested menus.
        if ((reason === 'click' || reason === 'tab') && this._parentSbbMenu) {
          this._parentSbbMenu.closed.emit(reason);
        }
      });
    }
  }
  private _menu: SbbMenuPanel;

  /** Data to be passed along to any lazily-rendered content. */
  @Input('sbbMenuTriggerData') menuData: any;

  /**
   * Whether focus should be restored when the menu is closed.
   * Note that disabling this option can have accessibility implications
   * and it's up to you to manage focus, if you decide to turn it off.
   */
  @Input('sbbMenuTriggerRestoreFocus') restoreFocus: boolean = true;

  /** Event emitted when the associated menu is opened. */
  @Output() readonly menuOpened: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the associated menu is closed. */
  @Output() readonly menuClosed: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _overlay: Overlay,
    private _element: ElementRef<HTMLElement>,
    private _viewContainerRef: ViewContainerRef,
    @Inject(SBB_MENU_SCROLL_STRATEGY) scrollStrategy: any,
    @Inject(SBB_MENU_PANEL) @Optional() parentMenu: SbbMenuPanel,
    // `SbbMenuTrigger` is commonly used in combination with a `SbbMenuItem`.
    @Optional() @Self() private _menuItemInstance: SbbMenuItem,
    private _focusMonitor?: FocusMonitor
  ) {
    super();

    this._scrollStrategy = scrollStrategy;
    this._parentSbbMenu = parentMenu instanceof SbbMenu ? parentMenu : undefined;

    _element.nativeElement.addEventListener(
      'touchstart',
      this._handleTouchStart,
      passiveEventListenerOptions
    );

    if (_menuItemInstance) {
      _menuItemInstance._triggersSubmenu = this.triggersSubmenu();
    }
  }

  ngAfterContentInit() {
    this._checkMenu();
    this._handleHover();
  }

  ngOnDestroy() {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }

    this._element.nativeElement.removeEventListener(
      'touchstart',
      this._handleTouchStart,
      passiveEventListenerOptions
    );

    this._menuCloseSubscription.unsubscribe();
    this._closingActionsSubscription.unsubscribe();
    this._hoverSubscription.unsubscribe();
  }

  /** Whether the menu is open. */
  get menuOpen(): boolean {
    return this._menuOpen;
  }

  /** Whether the menu triggers a sub-menu or a top-level one. */
  triggersSubmenu(): boolean {
    return !!(this._menuItemInstance && this._parentSbbMenu);
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

    const overlayRef = this._createOverlay();
    const overlayConfig = overlayRef.getConfig();

    this._setPosition(overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy);
    overlayConfig.hasBackdrop =
      this.menu.hasBackdrop == null ? !this.triggersSubmenu() : this.menu.hasBackdrop;
    overlayRef.attach(this._getPortal());

    if (this.menu.lazyContent) {
      this.menu.lazyContent.attach(this.menuData);
    }

    this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this.closeMenu());
    this._initMenu();

    if (this.menu instanceof SbbMenu) {
      this.menu._startAnimation();
    }
  }

  /** Closes the menu. */
  closeMenu(): void {
    this.menu.closed.emit();
  }

  /**
   * Focuses the menu trigger.
   * @param origin Source of the menu trigger's focus.
   */
  focus(origin?: FocusOrigin, options?: FocusOptions) {
    if (this._focusMonitor && origin) {
      this._focusMonitor.focusVia(this._element, origin, options);
    } else {
      this._element.nativeElement.focus(options);
    }
  }

  /** Closes the menu and does the necessary cleanup. */
  private _destroyMenu(reason: SbbMenuCloseReason) {
    if (!this._overlayRef || !this.menuOpen) {
      return;
    }

    const menu = this.menu;
    this._closingActionsSubscription.unsubscribe();
    this._overlayRef.detach();

    // Always restore focus if the user is navigating using the keyboard or the menu was opened
    // programmatically. We don't restore for non-root triggers, because it can prevent focus
    // from making it back to the root trigger when closing a long chain of menus by clicking
    // on the backdrop.
    if (this.restoreFocus && (reason === 'keydown' || !this._openedBy || !this.triggersSubmenu())) {
      this.focus(this._openedBy);
    }

    this._openedBy = undefined;

    if (menu instanceof SbbMenu) {
      menu._resetAnimation();

      if (menu.lazyContent) {
        // Wait for the exit animation to finish before detaching the content.
        menu._animationDone
          .pipe(
            filter((event) => event.toState === 'void'),
            take(1),
            // Interrupt if the content got re-attached.
            takeUntil(menu.lazyContent._attached)
          )
          .subscribe({
            next: () => menu.lazyContent!.detach(),
            // No matter whether the content got re-attached, reset the menu.
            complete: () => this._setIsMenuOpen(false),
          });
      } else {
        this._setIsMenuOpen(false);
      }
    } else {
      this._setIsMenuOpen(false);

      if (menu.lazyContent) {
        menu.lazyContent.detach();
      }
    }
  }

  /**
   * This method sets the menu state to open and focuses the first item if
   * the menu was opened via the keyboard.
   */
  private _initMenu(): void {
    this.menu.parentMenu = this.triggersSubmenu() ? this._parentSbbMenu : undefined;
    this.menu.triggerWidth = this._element.nativeElement.clientWidth;
    this._setMenuElevation();
    this.menu.focusFirstItem(this._openedBy || 'program');
    this._setIsMenuOpen(true);
  }

  /** Updates the menu elevation based on the amount of parent menus that it has. */
  private _setMenuElevation(): void {
    if (this.menu.setElevation) {
      let depth = 0;
      let parentMenu = this.menu.parentMenu;

      while (parentMenu) {
        depth++;
        parentMenu = parentMenu.parentMenu;
      }

      this.menu.setElevation(depth);
    }
  }

  // set state rather than toggle to support triggers sharing a menu
  private _setIsMenuOpen(isOpen: boolean): void {
    this._menuOpen = isOpen;
    this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();

    if (this.triggersSubmenu()) {
      this._menuItemInstance._highlighted = isOpen;
    }
  }

  /**
   * This method checks that a valid instance of SbbMenu has been passed into
   * sbbMenuTriggerFor. If not, an exception is thrown.
   */
  private _checkMenu() {
    if (!this.menu && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwSbbMenuMissingError();
    }
  }

  /**
   * This method creates the overlay from the provided menu's template and saves its
   * OverlayRef so that it can be attached to the DOM when openMenu is called.
   */
  private _createOverlay(): OverlayRef {
    if (!this._overlayRef) {
      const config = this._getOverlayConfig();
      this._subscribeToPositions(config.positionStrategy as FlexibleConnectedPositionStrategy);
      this._overlayRef = this._overlay.create(config);

      // Consume the `keydownEvents` in order to prevent them from going to another overlay.
      // Ideally we'd also have our keyboard event logic in here, however doing so will
      // break anybody that may have implemented the `SbbMenuPanel` themselves.
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
        .flexibleConnectedTo(this._element)
        .withLockedPosition()
        .withGrowAfterOpen()
        .withTransformOriginOn('.sbb-menu-panel'),
      backdropClass: this.menu.backdropClass || 'cdk-overlay-transparent-backdrop',
      panelClass: coerceStringArray(this.menu.overlayPanelClass).concat(
        `sbb-menu-panel-variant-${this._triggerVariant === '' ? 'standard' : this._triggerVariant}`
      ),
      scrollStrategy: this._scrollStrategy(),
    });
  }
  /**
   * Listens to changes in the position of the overlay and sets the correct classes
   * on the menu based on the new position. This ensures the animation origin is always
   * correct, even if a fallback position is used for the overlay.
   */
  private _subscribeToPositions(position: FlexibleConnectedPositionStrategy): void {
    if (this.menu.setPositionClasses) {
      position.positionChanges.subscribe((change) => {
        const posX: SbbMenuPositionX =
          change.connectionPair.overlayX === 'start' ? 'after' : 'before';
        const posY: SbbMenuPositionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';

        Array.from(this._element.nativeElement.classList)
          .filter((className) => className.startsWith('sbb-menu-trigger-position-'))
          .forEach((className) => this._element.nativeElement.classList.remove(className));
        this._element.nativeElement.classList.add(`sbb-menu-trigger-position-${posX}`);
        this._element.nativeElement.classList.add(`sbb-menu-trigger-position-${posY}`);

        this.menu.setPositionClasses!(posX, posY);
      });
    }
  }

  /**
   * Sets the appropriate positions on a position strategy
   * so the overlay connects with the trigger correctly.
   * @param positionStrategy Strategy whose position to update.
   */
  private _setPosition(positionStrategy: FlexibleConnectedPositionStrategy) {
    let [originX, originFallbackX]: HorizontalConnectionPos[] =
      !this.menu.xPosition || this.menu.xPosition === 'before'
        ? ['end', 'start']
        : ['start', 'end'];

    const [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
      !this.menu.yPosition || this.menu.yPosition === 'below'
        ? ['top', 'bottom']
        : ['bottom', 'top'];

    let [originY, originFallbackY] = [overlayY, overlayFallbackY];
    let [overlayX, overlayFallbackX] = [originX, originFallbackX];
    let offsetY = 0;
    let offsetX = 0;

    if (this.triggersSubmenu()) {
      // When the menu is a sub-menu, it should always align itself
      // to the edges of the trigger, instead of overlapping it.
      overlayFallbackX = originX = this.menu.xPosition === 'before' ? 'start' : 'end';
      originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
      offsetY = overlayY === 'bottom' ? -MENU_PANEL_TOP_PADDING : MENU_PANEL_TOP_PADDING;
      offsetX = overlayX === 'end' ? SUBMENU_PANEL_LEFT_OVERLAP : -SUBMENU_PANEL_LEFT_OVERLAP;
    } else if (!this.menu.overlapTrigger) {
      originY = overlayY === 'top' ? 'bottom' : 'top';
      originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
    }

    positionStrategy.withPositions([
      { originX, originY, overlayX, overlayY, offsetY, offsetX },
      {
        originX: originFallbackX,
        originY,
        overlayX: overlayFallbackX,
        overlayY,
        offsetY,
        offsetX: -offsetX,
      },
      {
        originX,
        originY: originFallbackY,
        overlayX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY,
        offsetX: offsetX,
      },
      {
        originX: originFallbackX,
        originY: originFallbackY,
        overlayX: overlayFallbackX,
        overlayY: overlayFallbackY,
        offsetY: -offsetY,
        offsetX: -offsetX,
      },
    ]);
  }

  /** Returns a stream that emits whenever an action that should close the menu occurs. */
  private _menuClosingActions() {
    const backdrop = this._overlayRef!.backdropClick();
    const detachments = this._overlayRef!.detachments();
    const parentClose = this._parentSbbMenu ? this._parentSbbMenu.closed : observableOf();
    const hover = this._parentSbbMenu
      ? this._parentSbbMenu._hovered().pipe(
          filter((active) => active !== this._menuItemInstance),
          filter(() => this._menuOpen)
        )
      : observableOf();

    return merge(backdrop, parentClose, hover, detachments);
  }

  /** Handles mouse presses on the trigger. */
  @HostListener('mousedown', ['$event'])
  _handleMousedown(event: MouseEvent): void {
    if (!isFakeMousedownFromScreenReader(event)) {
      // Since right or middle button clicks won't trigger the `click` event,
      // we shouldn't consider the menu as opened by mouse in those cases.
      this._openedBy = event.button === 0 ? 'mouse' : undefined;

      // Since clicking on the trigger won't close the menu if it opens a sub-menu,
      // we should prevent focus from moving onto it via click to avoid the
      // highlight from lingering on the menu item.
      if (this.triggersSubmenu()) {
        event.preventDefault();
      }
    }
  }

  /** Handles key presses on the trigger. */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;

    // Pressing enter on the trigger will trigger the click handler later.
    if (keyCode === ENTER || keyCode === SPACE) {
      this._openedBy = 'keyboard';
    }

    if (this.triggersSubmenu() && keyCode === RIGHT_ARROW) {
      this._openedBy = 'keyboard';
      this.openMenu();
    }
  }

  /** Handles click events on the trigger. */
  @HostListener('click', ['$event'])
  _handleClick(event: MouseEvent): void {
    if (this.triggersSubmenu()) {
      // Stop event propagation to avoid closing the parent menu.
      event.stopPropagation();
      this.openMenu();
    } else {
      this.toggleMenu();
    }
  }

  /** Handles the cases where the user hovers over the trigger. */
  private _handleHover() {
    // Subscribe to changes in the hovered item in order to toggle the panel.
    if (!this.triggersSubmenu() || !this._parentSbbMenu) {
      return;
    }

    this._hoverSubscription = this._parentSbbMenu
      ._hovered()
      // Since we might have multiple competing triggers for the same menu (e.g. a sub-menu
      // with different data and triggers), we have to delay it by a tick to ensure that
      // it won't be closed immediately after it is opened.
      .pipe(
        filter((active) => active === this._menuItemInstance && !active.disabled),
        delay(0, asapScheduler)
      )
      .subscribe(() => {
        this._openedBy = 'mouse';

        // If the same menu is used between multiple triggers, it might still be animating
        // while the new trigger tries to re-open it. Wait for the animation to finish
        // before doing so. Also interrupt if the user moves to another item.
        if (this.menu instanceof SbbMenu && this.menu._isAnimating) {
          // We need the `delay(0)` here in order to avoid
          // 'changed after checked' errors in some cases. See #12194.
          this.menu._animationDone
            .pipe(take(1), delay(0, asapScheduler), takeUntil(this._parentSbbMenu!._hovered()))
            .subscribe(() => this.openMenu());
        } else {
          this.openMenu();
        }
      });
  }

  /** Gets the portal that should be attached to the overlay. */
  private _getPortal(): TemplatePortal {
    // Note that we can avoid this check by keeping the portal on the menu panel.
    // While it would be cleaner, we'd have to introduce another required method on
    // `SbbMenuPanel`, making it harder to consume.
    if (!this._portal || this._portal.templateRef !== this.menu.templateRef) {
      this._portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
    }

    return this._portal;
  }
}
