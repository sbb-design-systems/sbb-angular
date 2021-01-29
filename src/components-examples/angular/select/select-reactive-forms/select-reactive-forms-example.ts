import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * @title Select Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-select-reactive-forms-example',
  templateUrl: './select-reactive-forms-example.html',
})
export class SelectReactiveFormsExample {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false,
    });
  }
}
