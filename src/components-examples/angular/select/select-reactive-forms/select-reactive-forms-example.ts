import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

/**
 * @title Select Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-select-reactive-forms-example',
  templateUrl: 'select-reactive-forms-example.html',
})
export class SelectReactiveFormsExample {
  form: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false,
      readonly: false,
    });
  }
}
