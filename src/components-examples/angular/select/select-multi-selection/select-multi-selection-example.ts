import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * @title Select Multiple Selection
 * @order 40
 */
@Component({
  selector: 'sbb-select-multi-selection-example',
  templateUrl: './select-multi-selection-example.html',
})
export class SelectMultiSelectionExample {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: [[]],
      optionDisabled: false,
    });
  }
}
