import { NgControl } from '@angular/forms';

export interface RadioButtonInterface {
  checked: boolean;
  name: string;

  /** @docs-private */
  _control: NgControl;
}
