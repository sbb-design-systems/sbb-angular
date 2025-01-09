// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { _IdGenerator } from '@angular/cdk/a11y';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { mixinVariant } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import {
  SbbMenu,
  SbbMenuInheritedTriggerContext,
  SbbMenuTrigger,
  SBB_MENU_INHERITED_TRIGGER_CONTEXT,
} from '@sbb-esta/angular/menu';
import { SbbMenuDynamicTrigger } from '@sbb-esta/angular/menu';

import { SbbUsermenuIcon } from './usermenu-icon';

// Boilerplate for applying mixins to SbbNotification.
const _SbbUsermenuMixinBase = mixinVariant(class {});

export const _sbbUsermenuMenuInheritedTriggerContext: SbbMenuInheritedTriggerContext = {
  type: 'usermenu',
  panelWidth: 288,
  xPosition: 'before',
  animationStartStateResolver: (context) => ({
    value: 'enter-usermenu',
    params: {
      width: context.panelWidth! * (context.scalingFactor ?? 1) + 'px',
    },
  }),
};

@Component({
  selector: 'sbb-usermenu',
  templateUrl: './usermenu.html',
  styleUrls: ['./usermenu.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-usermenu sbb-icon-scaled',
    '[attr.id]': 'id',
    '[class.sbb-usermenu-user-info-has-display-name]': '!!displayName',
  },
  providers: [
    {
      provide: SBB_MENU_INHERITED_TRIGGER_CONTEXT,
      useValue: _sbbUsermenuMenuInheritedTriggerContext,
    },
  ],
  imports: [SbbIcon, SbbMenuTrigger, SbbMenuDynamicTrigger, NgTemplateOutlet, AsyncPipe],
})
export class SbbUsermenu extends _SbbUsermenuMixinBase {
  _labelLogin: string = $localize`:Button label for login@@sbbUsermenuLogin:Login`;

  get _labelOpenPanel() {
    return $localize`:Aria label to open user menu@@sbbUsermenuOpenPanel:Logged in as ${
      this.displayName || this.userName
    }. Click or press enter to open user menu.`;
  }

  /** Identifier of the usermenu. */
  id: string = inject(_IdGenerator).getId('sbb-usermenu-');

  /**
   * The user name is only displayed if the menu is open.
   * If userName is set, logged in state is active.
   */
  @Input() userName?: string;

  /**
   * The display name is shown on collapsed trigger and on opened state of the menu (except on mobile devices).
   * If displayName is set, logged in state is active.
   */
  @Input() displayName?: string;

  /** Reference to the menu. */
  @Input() menu: SbbMenu;

  /** Event emitted on log in of a user. */
  @Output() loginRequest: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the associated menu is opened. */
  @Output() readonly menuOpened: EventEmitter<void> = new EventEmitter<void>();

  /** Event emitted when the associated menu is closed. */
  @Output() readonly menuClosed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(SbbMenuTrigger) private _menuTrigger: SbbMenuTrigger;

  /** Reference to user provided icon */
  @ContentChild(SbbUsermenuIcon, { read: TemplateRef })
  _icon?: TemplateRef<any>;

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._menuTrigger?.menuOpen;
  }

  /** Whether the user is logged in or not. */
  get _loggedIn(): boolean {
    return !!this.userName || !!this.displayName;
  }

  /** Initial letters of user's displayName (or userName if no displayName is provided). */
  get _initialLetters(): string {
    const name = this.displayName ? this.displayName : this.userName || '';
    const names: string[] = name.split(' ');
    const filteredNames = names.filter((namePart) => namePart[0]?.match(/^\p{L}/u));

    if (filteredNames.length === 0) {
      return '';
    }

    if (filteredNames.length === 1) {
      return filteredNames[0].substring(0, 2).toLocaleUpperCase();
    }

    return filteredNames
      .reduce((current, next) => {
        return current[0] + next[0];
      })
      .toLocaleUpperCase();
  }

  _emitLogin() {
    this.loginRequest.emit();
  }

  /** Open the overlay panel */
  open(): void {
    if (this._loggedIn) {
      this._menuTrigger?.openMenu();
    }
  }

  /** Close the overlay panel */
  close(): void {
    this._menuTrigger?.closeMenu();
  }

  /** Toggle the visibility of the overlay panel */
  toggle(): void {
    if (this._loggedIn) {
      this._menuTrigger?.toggleMenu();
    }
  }

  _emitMenuOpened() {
    this.menuOpened.emit();
  }

  _emitMenuClosed() {
    this.menuClosed.emit();
  }
}
