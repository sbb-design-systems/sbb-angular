import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * @title Vertical Checkbox Group
 * @order 20
 */
@Component({
  selector: 'sbb-checkbox-group-reactive-forms-vertical-example',
  templateUrl: './checkbox-group-reactive-forms-vertical-example.html',
})
export class CheckboxGroupReactiveFormsVerticalExample {
  form: FormGroup;
  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'Check 1': true,
      'Check 2': false,
      'Check 3': false,
    });
  }
}
