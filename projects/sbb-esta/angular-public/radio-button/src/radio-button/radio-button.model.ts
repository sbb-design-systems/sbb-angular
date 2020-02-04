import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * @deprecated No longer in use.
 */
@Directive()
export abstract class RadioButton {
  /** Analog to HTML 'name' attribute used to group radios for unique selection. */
  @Input() name: string;
  /** The value of this radio button. */
  @Input() value: any = null;

  /** @docs-private */
  _control: NgControl;

  abstract uncheck();
}
