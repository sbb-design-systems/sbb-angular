import { Directive, HostBinding } from '@angular/core';

@Directive()
export abstract class BaseButton {
  /**
   * Button modes available for different purposes.
   */
  abstract mode: string;

  /** @docs-private */
  @HostBinding('class.sbb-button') buttonClass = true;

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
