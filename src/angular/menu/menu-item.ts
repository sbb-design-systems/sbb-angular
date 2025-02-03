import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { Subject } from 'rxjs';

import { SbbMenuPanel, SBB_MENU_PANEL } from './menu-panel';

/**
 * Single item inside a `sbb-menu`. Provides the menu item styling and accessibility treatment.
 */
@Component({
  selector: '[sbb-menu-item]',
  exportAs: 'sbbMenuItem',
  host: {
    '[attr.role]': 'role',
    '[class.sbb-active]': '_highlighted',
    '[class.sbb-menu-item-submenu-trigger]': '_triggersSubmenu',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.disabled]': 'disabled || null',
    class: 'sbb-menu-item sbb-link-reset sbb-icon-fit',
    '(click)': '_checkDisabled($event)',
    '(mouseenter)': '_handleMouseEnter()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'menu-item.html',
  imports: [SbbIcon],
})
export class SbbMenuItem implements FocusableOption, AfterViewInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _document = inject(DOCUMENT);
  private _focusMonitor = inject(FocusMonitor);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  _parentMenu?: SbbMenuPanel<SbbMenuItem> | null | undefined = inject<SbbMenuPanel<SbbMenuItem>>(
    SBB_MENU_PANEL,
    { optional: true },
  );

  /** Whether the menu item is disabled. */
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  /** ARIA role for the menu item. */
  @Input() role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' = 'menuitem';

  /** Stream that emits when the menu item is hovered. */
  readonly _hovered: Subject<SbbMenuItem> = new Subject<SbbMenuItem>();

  /** Stream that emits when the menu item is focused. */
  readonly _focused: Subject<SbbMenuItem> = new Subject<SbbMenuItem>();

  /** Whether the menu item is highlighted. */
  _highlighted: boolean = false;

  /** Whether the menu item acts as a trigger for a sub-menu. */
  _triggersSubmenu: boolean = false;

  constructor(...args: unknown[]);
  constructor() {}

  /** Focuses the menu item. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }

    this._focused.next(this);
  }

  ngAfterViewInit() {
    // Start monitoring the element so it gets the appropriate focused classes. We want
    // to show the focus style for menu items only when the focus was not caused by a
    // mouse or touch interaction.
    this._focusMonitor.monitor(this._elementRef, false);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);

    this._hovered.complete();
    this._focused.complete();
  }

  /** Used to set the `tabindex`. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Returns the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Prevents the default element actions if it is disabled. */
  _checkDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Emits to the hover stream. */
  _handleMouseEnter() {
    this._hovered.next(this);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    const clone = this._elementRef.nativeElement.cloneNode(true) as HTMLElement;
    const icons = clone.querySelectorAll('sbb-icon');

    // Strip away icons so they don't show up in the text.
    for (let i = 0; i < icons.length; i++) {
      icons[i].remove();
    }

    return clone.textContent?.trim() || '';
  }

  _setHighlighted(isHighlighted: boolean) {
    // We need to mark this for check for the case where the content is coming from a
    // `sbbMenuContent` whose change detection tree is at the declaration position,
    // not the insertion position. See #23175.
    this._highlighted = isHighlighted;
    this._changeDetectorRef.markForCheck();
  }

  _hasFocus(): boolean {
    return this._document.activeElement === this._getHostElement();
  }
}
