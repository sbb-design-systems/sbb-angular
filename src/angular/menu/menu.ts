import { AnimationEvent } from '@angular/animations';
import { FocusKeyManager, FocusOrigin, _IdGenerator } from '@angular/cdk/a11y';
import { DOWN_ARROW, ESCAPE, hasModifierKey, LEFT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  afterNextRender,
  AfterRenderRef,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { sbbMenuAnimations } from './menu-animations';
import { SbbMenuContent, SBB_MENU_CONTENT } from './menu-content';
import { throwSbbMenuInvalidPositionX, throwSbbMenuInvalidPositionY } from './menu-errors';
import { SbbMenuItem } from './menu-item';
import { SbbMenuPanel, SBB_MENU_PANEL } from './menu-panel';
import { SbbMenuPositionX, SbbMenuPositionY } from './menu-positions';
import type { SbbMenuTriggerContext } from './menu-trigger';

/** Default `sbb-menu` options that can be overridden. */
export interface SbbMenuDefaultOptions {
  /** The x-axis position of the menu. */
  xPosition?: SbbMenuPositionX;

  /** The y-axis position of the menu. */
  yPosition?: SbbMenuPositionY;

  /** Whether the menu should overlap the menu trigger. */
  overlapTrigger: boolean;

  /** Class to be applied to the menu's backdrop. */
  backdropClass: string;

  /** Class or list of classes to be applied to the menu's overlay panel. */
  overlayPanelClass?: string | string[];

  /** Whether the menu has a backdrop. */
  hasBackdrop?: boolean;
}

/** Injection token to be used to override the default options for `sbb-menu`. */
export const SBB_MENU_DEFAULT_OPTIONS = new InjectionToken<SbbMenuDefaultOptions>(
  'sbb-menu-default-options',
  {
    providedIn: 'root',
    factory: SBB_MENU_DEFAULT_OPTIONS_FACTORY,
  },
);

/** @docs-private */
export function SBB_MENU_DEFAULT_OPTIONS_FACTORY(): SbbMenuDefaultOptions {
  return {
    overlapTrigger: false,
    xPosition: 'after',
    yPosition: 'below',
    backdropClass: 'cdk-overlay-transparent-backdrop',
  };
}

export type SbbMenuPlainAnimationState = 'enter' | 'void' | 'enter-usermenu';

export interface SbbMenuAnimationStateWithParams {
  value: SbbMenuPlainAnimationState;
  params?: { [key: string]: string };
}

export type SbbMenuAnimationState = SbbMenuPlainAnimationState | SbbMenuAnimationStateWithParams;

/** Reason why the menu was closed. */
export type SbbMenuCloseReason = void | 'click' | 'keydown' | 'tab';

@Component({
  selector: 'sbb-menu',
  templateUrl: 'menu.html',
  styleUrls: ['menu.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbMenu',
  host: {
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  animations: [sbbMenuAnimations.transformMenu],
  providers: [{ provide: SBB_MENU_PANEL, useExisting: SbbMenu }],
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class SbbMenu implements AfterContentInit, SbbMenuPanel<SbbMenuItem>, OnInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _defaultOptions = inject<SbbMenuDefaultOptions>(SBB_MENU_DEFAULT_OPTIONS);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _keyManager: FocusKeyManager<SbbMenuItem>;
  private _xPosition: SbbMenuPositionX = this._defaultOptions.xPosition;
  private _yPosition: SbbMenuPositionY = this._defaultOptions.yPosition;
  private _firstItemFocusRef?: AfterRenderRef;
  private _previousElevation: string;
  private _elevationPrefix: string = 'sbb-elevation-z';
  private _baseElevation: number = 4;

  /** All items inside the menu. Includes items nested inside another menu. */
  @ContentChildren(SbbMenuItem, { descendants: true }) _allItems: QueryList<SbbMenuItem>;

  /** Only the direct descendant menu items. */
  _directDescendantItems: QueryList<SbbMenuItem> = new QueryList<SbbMenuItem>();

  /** Classes to be applied to the menu panel. */
  _classList: { [key: string]: boolean } = {};

  /** Current state of the panel animation. */
  _panelAnimationState: SbbMenuAnimationState = 'void';

  /** Emits whenever an animation on the menu completes. */
  readonly _animationDone: Subject<AnimationEvent> = new Subject<AnimationEvent>();

  /** Whether the menu is animating. */
  _isAnimating: boolean;

  /** Parent menu of the current menu panel. */
  parentMenu: SbbMenuPanel | undefined;

  /** Class or list of classes to be added to the overlay panel. */
  overlayPanelClass: string | string[] = this._defaultOptions.overlayPanelClass || '';

  /** Class to be added to the backdrop element. */
  @Input() backdropClass: string = this._defaultOptions.backdropClass;

  /** aria-label for the menu panel. */
  @Input('aria-label') ariaLabel: string;

  /** aria-labelledby for the menu panel. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** aria-describedby for the menu panel. */
  @Input('aria-describedby') ariaDescribedby: string;

  /** Position of the menu in the X axis. */
  @Input()
  get xPosition(): SbbMenuPositionX {
    return this._xPosition;
  }
  set xPosition(value: SbbMenuPositionX) {
    if (
      value !== 'before' &&
      value !== 'after' &&
      (typeof ngDevMode === 'undefined' || ngDevMode)
    ) {
      throwSbbMenuInvalidPositionX();
    }
    this._xPosition = value;
    this.setPositionClasses();
  }

  /** Position of the menu in the Y axis. */
  @Input()
  get yPosition(): SbbMenuPositionY {
    return this._yPosition;
  }
  set yPosition(value: SbbMenuPositionY) {
    if (value !== 'above' && value !== 'below' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwSbbMenuInvalidPositionY();
    }
    this._yPosition = value;
    this.setPositionClasses();
  }

  /** @docs-private */
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  /**
   * Menu content that will be rendered lazily.
   * @docs-private
   */
  @ContentChild(SBB_MENU_CONTENT) lazyContent: SbbMenuContent;

  /** Whether the menu should overlap its trigger. */
  @Input({ transform: booleanAttribute })
  overlapTrigger: boolean = this._defaultOptions.overlapTrigger;

  /** Whether the menu has a backdrop. */
  @Input({ transform: booleanAttribute })
  hasBackdrop: boolean | undefined = this._defaultOptions.hasBackdrop;

  /**
   * This method takes classes set on the host sbb-menu element and applies them on the
   * menu template that displays in the overlay container. Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set panelClass(classes: string) {
    const previousPanelClass = this._previousPanelClass;
    const newClassList = { ...this._classList };

    if (previousPanelClass && previousPanelClass.length) {
      previousPanelClass.split(' ').forEach((className: string) => {
        newClassList[className] = false;
      });
    }

    this._previousPanelClass = classes;

    if (classes && classes.length) {
      classes.split(' ').forEach((className: string) => {
        newClassList[className] = true;
      });

      this._elementRef.nativeElement.className = '';
    }

    this._classList = newClassList;
  }
  private _previousPanelClass: string;

  get triggerContext() {
    return this._triggerContext;
  }
  set triggerContext(value: SbbMenuTriggerContext) {
    if (this._triggerContext && this._triggerContext.type !== value.type) {
      this._classList[`sbb-menu-panel-type-${this._triggerContext.type}`] = false;
    }
    this._classList[`sbb-menu-panel-type-${value.type}`] = true;
    this._triggerContext = value;
  }
  private _triggerContext: SbbMenuTriggerContext;

  /** Event emitted when the menu is closed. */
  @Output()
  readonly closed: EventEmitter<SbbMenuCloseReason> = new EventEmitter<SbbMenuCloseReason>();

  readonly panelId = inject(_IdGenerator).getId('sbb-menu-panel-');

  private _injector = inject(Injector);

  constructor(...args: unknown[]);
  constructor() {}

  ngOnInit() {
    this.setPositionClasses();
  }

  ngAfterContentInit() {
    this._updateDirectDescendants();
    this._keyManager = new FocusKeyManager(this._directDescendantItems)
      .withWrap()
      .withTypeAhead()
      .withHomeAndEnd();
    this._keyManager.tabOut.subscribe(() => this.closed.emit('tab'));

    // If a user manually (programmatically) focuses a menu item, we need to reflect that focus
    // change back to the key manager. Note that we don't need to unsubscribe here because _focused
    // is internal and we know that it gets completed on destroy.
    this._directDescendantItems.changes
      .pipe(
        startWith(this._directDescendantItems),
        switchMap((items) => merge(...items.map((item: SbbMenuItem) => item._focused))),
      )
      .subscribe((focusedItem) => this._keyManager.updateActiveItem(focusedItem as SbbMenuItem));

    this._directDescendantItems.changes.subscribe((itemsList: QueryList<SbbMenuItem>) => {
      // Move focus to another item, if the active item is removed from the list.
      // We need to debounce the callback, because multiple items might be removed
      // in quick succession.
      const manager = this._keyManager;

      if (this._panelAnimationState === 'enter' && manager.activeItem?._hasFocus()) {
        const items = itemsList.toArray();
        const index = Math.max(0, Math.min(items.length - 1, manager.activeItemIndex || 0));

        if (items[index] && !items[index].disabled) {
          manager.setActiveItem(index);
        } else {
          manager.setNextItemActive();
        }
      }
    });
  }

  ngOnDestroy() {
    this._keyManager?.destroy();
    this._directDescendantItems.destroy();
    this.closed.complete();
    this._firstItemFocusRef?.destroy();
  }

  /** Stream that emits whenever the hovered menu item changes. */
  _hovered(): Observable<SbbMenuItem> {
    // Coerce the `changes` property because Angular types it as `Observable<any>`
    const itemChanges = this._directDescendantItems.changes as Observable<QueryList<SbbMenuItem>>;
    return itemChanges.pipe(
      startWith(this._directDescendantItems),
      switchMap((items) => merge(...items.map((item: SbbMenuItem) => item._hovered))),
    ) as Observable<SbbMenuItem>;
  }

  /** Handle a keyboard event from the menu, delegating to the appropriate action. */
  _handleKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const manager = this._keyManager;

    switch (keyCode) {
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this.closed.emit('keydown');
        }
        break;
      case LEFT_ARROW:
        if (this.parentMenu) {
          this.closed.emit('keydown');
        }
        break;
      default:
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
          manager.setFocusOrigin('keyboard');
        }

        manager.onKeydown(event);
        return;
    }
  }

  /** Whether to display the menu header which mirrors the trigger content. */
  _hasHeader() {
    return !this.parentMenu && this.triggerContext && this.triggerContext.type !== 'headless';
  }

  /**
   * Focus the first item in the menu.
   * @param origin Action from which the focus originated. Used to set the correct styling.
   */
  focusFirstItem(origin: FocusOrigin = 'program'): void {
    // Wait for `afterNextRender` to ensure iOS VoiceOver screen reader focuses the first item (#24735).
    this._firstItemFocusRef?.destroy();
    this._firstItemFocusRef = afterNextRender(
      () => {
        let menuPanel: HTMLElement | null = null;

        if (this._directDescendantItems.length) {
          // Because the `sbb-menu` panel is at the DOM insertion point, not inside the overlay, we don't
          // have a nice way of getting a hold of the menu panel. We can't use a `ViewChild` either
          // because the panel is inside an `ng-template`. We work around it by starting from one of
          // the items and walking up the DOM.
          menuPanel = this._directDescendantItems.first!._getHostElement().closest('[role="menu"]');
        }

        // If an item in the menuPanel is already focused, avoid overriding the focus.
        if (!menuPanel || !menuPanel.contains(document.activeElement)) {
          const manager = this._keyManager;
          manager.setFocusOrigin(origin).setFirstItemActive();

          // If there's no active item at this point, it means that all the items are disabled.
          // Move focus to the menu panel so keyboard events like Escape still work. Also this will
          // give _some_ feedback to screen readers.
          if (!manager.activeItem && menuPanel) {
            menuPanel.focus();
          }
        }
      },
      { injector: this._injector },
    );
  }

  /**
   * Resets the active item in the menu. This is used when the menu is opened, allowing
   * the user to start from the first option when pressing the down arrow.
   */
  resetActiveItem() {
    this._keyManager.setActiveItem(-1);
  }

  /**
   * Sets the menu panel elevation.
   * @param depth Number of parent menus that come before the menu.
   */
  setElevation(depth: number): void {
    // The elevation starts at the base and increases by one for each level.
    const elevation = this._baseElevation + depth;
    const newElevation = `${this._elevationPrefix}${elevation}`;
    const customElevation = Object.keys(this._classList).find((className) =>
      className.startsWith(this._elevationPrefix),
    );

    if (!customElevation || customElevation === this._previousElevation) {
      const newClassList = { ...this._classList };
      if (this._previousElevation) {
        newClassList[this._previousElevation] = false;
      }

      newClassList[newElevation] = true;
      this._previousElevation = newElevation;
      this._classList = newClassList;
    }
  }

  /**
   * Adds classes to the menu panel based on its position. Can be used by
   * consumers to add specific styling based on the position.
   * @param posX Position of the menu along the x axis.
   * @param posY Position of the menu along the y axis.
   * @docs-private
   */
  setPositionClasses(
    posX: SbbMenuPositionX = this.xPosition,
    posY: SbbMenuPositionY = this.yPosition,
  ) {
    this._classList = {
      ...this._classList,
      ['sbb-menu-panel-before']: posX === 'before',
      ['sbb-menu-panel-after']: posX === 'after',
      ['sbb-menu-panel-above']: posY === 'above',
      ['sbb-menu-panel-below']: posY === 'below',
    };

    this._changeDetectorRef.markForCheck();
  }

  /** Starts the enter animation. */
  _startAnimation() {
    // @breaking-change 8.0.0 Combine with _resetAnimation.
    this._panelAnimationState =
      this.triggerContext.animationStartStateResolver?.(this.triggerContext) ?? 'enter';
  }

  /** Resets the panel animation to its initial state. */
  _resetAnimation() {
    // @breaking-change 8.0.0 Combine with _startAnimation.
    this._panelAnimationState = 'void';
  }

  /** Callback that is invoked when the panel animation completes. */
  _onAnimationDone(event: AnimationEvent) {
    this._animationDone.next(event);
    this._isAnimating = false;
  }

  _onAnimationStart(event: AnimationEvent) {
    this._isAnimating = true;

    // Scroll the content element to the top as soon as the animation starts. This is necessary,
    // because we move focus to the first item while it's still being animated, which can throw
    // the browser off when it determines the scroll position. Alternatively we can move focus
    // when the animation is done, however moving focus asynchronously will interrupt screen
    // readers which are in the process of reading out the menu already. We take the `element`
    // from the `event` since we can't use a `ViewChild` to access the pane.
    const animationStartState =
      this._extractPlainAnimationState(
        this.triggerContext.animationStartStateResolver?.(this.triggerContext),
      ) ?? 'enter';
    if (event.toState === animationStartState && this._keyManager.activeItemIndex === 0) {
      event.element.scrollTop = 0;
    }

    if (event.toState === 'void') {
      event.element.classList.add('sbb-menu-panel-closing');
    } else {
      event.element.classList.remove('sbb-menu-panel-closing');
    }
  }

  private _extractPlainAnimationState(
    state?: SbbMenuAnimationState,
  ): SbbMenuPlainAnimationState | null {
    if (!state) {
      return null;
    }
    return typeof state === 'string' ? state : state.value;
  }

  /**
   * Sets up a stream that will keep track of any newly-added menu items and will update the list
   * of direct descendants. We collect the descendants this way, because `_allItems` can include
   * items that are part of child menus, and using a custom way of registering items is unreliable
   * when it comes to maintaining the item order.
   */
  private _updateDirectDescendants() {
    this._allItems.changes
      .pipe(startWith(this._allItems))
      .subscribe((items: QueryList<SbbMenuItem>) => {
        this._directDescendantItems.reset(items.filter((item) => item._parentMenu === this));
        this._directDescendantItems.notifyOnChanges();
      });
  }
}
