import { ContentChild, HostBinding, Input, TemplateRef } from '@angular/core';

import { ButtonIconDirective } from './button-icon.directive';

export abstract class BaseButton {
  /**
   * Button modes available for different purposes.
   */
  abstract mode: string;

  /**
   * Template that will contain icons.
   * Use the *sbbButtonIcon structural directive to provide the desired icon.
   */
  @Input()
  get icon(): TemplateRef<any> {
    return this._contentIcon || this._icon;
  }
  set icon(icon: TemplateRef<any>) {
    this._icon = icon;
  }
  private _icon: TemplateRef<any>;

  /** @docs-private */
  @HostBinding('class.sbb-button') buttonClass = true;

  /** @docs-private */
  @HostBinding('class.sbb-button-has-icon') get buttonHasIconClass() {
    return !!this.icon;
  }

  /** @docs-private */
  @ContentChild(ButtonIconDirective, { read: TemplateRef, static: false })
  _contentIcon: TemplateRef<any>;

  /** @docs-private */
  @HostBinding('class.sbb-button-primary')
  get _primaryClass() {
    return this.mode === 'primary';
  }

  /** @docs-private */
  @HostBinding('class.sbb-button-secondary')
  get _secondaryClass() {
    return this.mode === 'secondary';
  }

  /** @docs-private */
  @HostBinding('class.sbb-button-ghost')
  get _ghostClass() {
    return this.mode === 'ghost';
  }
}
