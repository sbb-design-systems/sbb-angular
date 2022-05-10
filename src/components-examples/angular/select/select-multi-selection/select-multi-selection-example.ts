import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

/**
 * @title Select Multiple Selection
 * @order 40
 */
@Component({
  selector: 'sbb-select-multi-selection-example',
  templateUrl: 'select-multi-selection-example.html',
})
export class SelectMultiSelectionExample {
  form = this._formBuilder.group({
    value: [[]],
    optionDisabled: false,
  });

  constructor(private _formBuilder: FormBuilder) {}
}
