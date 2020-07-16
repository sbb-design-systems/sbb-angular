import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-checkbox-group-reactive-forms-vertical-example',
  templateUrl: './checkbox-group-reactive-forms-vertical-example.component.html',
})
export class CheckboxGroupReactiveFormsVerticalExampleComponent {
  form: FormGroup;
  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      'Check 1': true,
      'Check 2': false,
      'Check 3': false,
    });
  }
}
