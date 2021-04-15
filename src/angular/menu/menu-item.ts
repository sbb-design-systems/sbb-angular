import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable, CanDisableCtor, mixinDisabled } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';

import { SbbMenuPanel, SBB_MENU_PANEL } from './menu-panel';

// Boilerplate for applying mixins to SbbMenuItem.
/** @docs-private */
class SbbMenuItemBase {}
// tslint:disable-next-line:naming-convention
const _SbbMenuItemMixinBase: CanDisableCtor & typeof SbbMenuItemBase = mixinDisabled(
  SbbMenuItemBase
);

/**
 * Single item inside of a `sbb-menu`. Provides the menu item styling and accessibility treatment.
 */
@Component({
  selector: '[sbb-menu-item]',
  exportAs: 'sbbMenuItem',
  inputs: ['disabled'],
  host: {
    '[attr.role]': 'role',
    '[class.sbb-active]': '_highlighted',
    '[class.sbb-menu-item-submenu-trigger]': '_triggersSubmenu',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.disabled]': 'disabled || null',
    class: 'sbb-menu-item sbb-icon-fit',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'menu-item.html',
})
export class SbbMenuItem
  extends _SbbMenuItemMixinBase
  implements FocusableOption, CanDisable, AfterViewInit, OnDestroy {
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

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _focusMonitor?: FocusMonitor,
    @Inject(SBB_MENU_PANEL) @Optional() public _parentMenu?: SbbMenuPanel<SbbMenuItem>
  ) {
    super();
  }

  /** Focuses the menu item. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (this._focusMonitor && origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }

    this._focused.next(this);
  }

  ngAfterViewInit() {
    if (this._focusMonitor) {
      // Start monitoring the element so it gets the appropriate focused classes. We want
      // to show the focus style for menu items only when the focus was not caused by a
      // mouse or touch interaction.
      this._focusMonitor.monitor(this._elementRef, false);
    }
  }

  ngOnDestroy() {
    if (this._focusMonitor) {
      this._focusMonitor.stopMonitoring(this._elementRef);
    }

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
  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  @HostListener('click', ['$event'])
  _checkDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Emits to the hover stream. */
  // We have to use a `HostListener` here in order to support both Ivy and ViewEngine.
  // In Ivy the `host` bindings will be merged when this class is extended, whereas in
  // ViewEngine they're overwritten.
  // TODO(crisbeto): we move this back into `host` once Ivy is turned on by default.
  @HostListener('mouseenter')
  _handleMouseEnter() {
    this._hovered.next(this);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    const clone = this._elementRef.nativeElement.cloneNode(true) as HTMLElement;
    const icons = clone.querySelectorAll('sbb-icon');

    // Strip away icons so they don't show up in the text.
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      icon.parentNode?.removeChild(icon);
    }

    return clone.textContent?.trim() || '';
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
