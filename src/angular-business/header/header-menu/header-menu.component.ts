import { AnimationEvent } from '@angular/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FocusKeyManager, FocusOrigin } from '@angular/cdk/a11y';
import { DOWN_ARROW, END, ESCAPE, hasModifierKey, HOME, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkPortal, CdkPortalOutlet } from '@angular/cdk/portal';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { TypeRef } from '@sbb-esta/angular-core/common-behaviors';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { SbbHeaderMenuItem } from '../header-menu-item/header-menu-item.directive';
import { SBB_HEADER } from '../header/header-token';
import type { SbbHeader } from '../header/header.component';

let nextId = 0;

@Component({
  selector: 'sbb-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'sbbHeaderMenu',
  animations: [
    trigger('open', [
      state('closed', style({ transform: 'translateX(-100vw)' })),
      state('open-menu', style({ transform: 'translateX(0)' })),
      transition('closed <=> open-menu', animate('0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86)')),
    ]),
  ],
  host: {
    class: 'sbb-header-menu',
    '[id]': 'this.id',
    '[@open]': 'this._animationState',
    '[class.sbb-header-menus-collapsed]': 'this._header._menusCollapsed',
  },
})
export class SbbHeaderMenu implements AfterContentInit, OnDestroy {
  /** Unique ID to be used by menu trigger's "aria-owns" property. */
  id: string = `sbb-header-menu-${nextId++}`;

  /** Event emitted when the menu is closed. */
  @Output() readonly closed: EventEmitter<void | 'click' | 'keydown' | 'tab'> = new EventEmitter<
    void | 'click' | 'keydown' | 'tab'
  >();

  /** Reference to the menu items. */
  @ContentChildren(SbbHeaderMenuItem) _items: QueryList<SbbHeaderMenuItem>;

  /** @docs-private */
  @ViewChild(CdkPortal) _panelPortal: CdkPortal;
  /** @docs-private */
  @ViewChild(CdkPortalOutlet, { static: true }) _panelPortalOutlet: CdkPortalOutlet;

  /** Whether the menu panel is open. */
  get open(): boolean {
    return this._open && !!this.showPanel;
  }
  set open(value: boolean) {
    if (value !== this._open) {
      this._open = value;
      if (!value) {
        this._animationState = 'closed';
      } else if (!this._header._menusCollapsed) {
        this._animationState = 'open-panel';
      } else {
        this._animationState = 'open-menu';
      }
    }
  }
  private _open = false;

  /**
   * This method takes classes set on the host sbb-header-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set panelClass(classes: string) {
    const previousPanelClass = this._previousPanelClass;

    if (previousPanelClass && previousPanelClass.length) {
      previousPanelClass.split(' ').forEach((className: string) => {
        this._classList[className] = false;
      });
    }

    this._previousPanelClass = classes;

    if (classes && classes.length) {
      classes.split(' ').forEach((className: string) => {
        this._classList[className] = true;
      });

      this._elementRef.nativeElement.className = '';
    }
  }
  private _previousPanelClass: string;

  /** Whether the autocomplete panel should be visible, depending on option length. */
  showPanel: boolean = false;
  /** Manages active item in item list based on key events. */
  _keyManager: FocusKeyManager<SbbHeaderMenuItem>;
  /** Class list for the panel. */
  _classList: { [key: string]: boolean } = {};
  /** @docs-private */
  _panel: CdkPortal | null = null;
  /** @docs-private */
  _animationState: 'closed' | 'open-panel' | 'open-menu' = 'closed';

  /** Subscription to tab events on the menu panel */
  private _tabSubscription = Subscription.EMPTY;
  private _destroyed = new Subject<void>();

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    @Inject(SBB_HEADER) public _header: SbbHeader
  ) {}

  ngAfterContentInit() {
    (this._items.changes as Observable<SbbHeaderMenuItem[]>)
      .pipe(
        startWith(this._items.toArray()),
        map((i) => !!i.length),
        takeUntil(this._destroyed)
      )
      .subscribe((s) => (this.showPanel = s));
    this._keyManager = new FocusKeyManager(this._items).withWrap().withTypeAhead();
    this._tabSubscription = this._keyManager.tabOut.subscribe(() => this.closed.emit('tab'));
  }

  ngOnDestroy() {
    this._tabSubscription.unsubscribe();
    this.closed.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Focus the first item in the menu.
   * @param origin Action from which the focus originated. Used to set the correct styling.
   */
  focusFirstItem(origin: FocusOrigin = 'program'): void {
    const manager = this._keyManager;
    manager.setFocusOrigin(origin).setFirstItemActive();

    // If there's no active item at this point, it means that all the items are disabled.
    // Move focus to the menu panel so keyboard events like Escape still work. Also this will
    // give _some_ feedback to screen readers.
    if (!manager.activeItem && this._items.length) {
      let element = this._items.first._getHostElement().parentElement;

      // Because the `sbb-header-menu` is at the DOM insertion point, not inside the overlay, we don't
      // have a nice way of getting a hold of the menu panel. We can't use a `ViewChild` either
      // because the panel is inside an `ng-template`. We work around it by starting from one of
      // the items and walking up the DOM.
      while (element) {
        if (element.getAttribute('role') === 'menu') {
          element.focus();
          break;
        } else {
          element = element.parentElement;
        }
      }
    }
  }

  /**
   * Resets the active item in the menu. This is used when the menu is opened, allowing
   * the user to start from the first option when pressing the down arrow.
   */
  resetActiveItem() {
    this._keyManager.setActiveItem(-1);
  }

  @HostListener('@open.done', ['$event'])
  _onAnimationDone(event: AnimationEvent) {
    if (event.toState === 'closed' && event.fromState !== 'void') {
      this.closed.emit();
    }
  }

  @HostListener('keydown', ['$event'])
  _handleMenuKeydown(event: TypeRef<KeyboardEvent>) {
    if (event.keyCode === ESCAPE) {
      this.open = false;
    }
  }

  /** Handle a keyboard event from the menu, delegating to the appropriate action. */
  _handlePanelKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const manager = this._keyManager;

    switch (keyCode) {
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this.closed.emit('keydown');
        }
        break;
      case HOME:
      case END:
        if (!hasModifierKey(event)) {
          keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
          event.preventDefault();
        }
        break;
      default:
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
          manager.setFocusOrigin('keyboard');
        } else if (!this._header._menusCollapsed) {
          manager.onKeydown(event);
        }
    }
  }
}
