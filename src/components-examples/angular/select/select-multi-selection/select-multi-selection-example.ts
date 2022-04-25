import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

/**
 * @title Select Multiple Selection
 * @order 40
 */
@Component({
  selector: 'sbb-select-multi-selection-example',
  templateUrl: 'select-multi-selection-example.html',
})
export class SelectMultiSelectionExample {
  form: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.form = formBuilder.group({
      value: [[]],
      optionDisabled: false,
    });
  }
}
