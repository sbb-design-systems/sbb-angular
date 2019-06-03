import { Input } from '@angular/core';
import { NgControl } from '@angular/forms';

export abstract class RadioButton {
  @Input() name: string;
  @Input() value: any;

  /** @internal */
  // tslint:disable-next-line: naming-convention
  _control: NgControl;

  abstract uncheck();
}
