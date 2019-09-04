import { Input } from '@angular/core';
import { NgControl } from '@angular/forms';

export abstract class RadioButton {
  @Input() name: string;
  @Input() value: any;

  /** @docs-private */
  _control: NgControl;

  abstract uncheck();
}
