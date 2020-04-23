import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-reactive-forms-example',
  templateUrl: './select-reactive-forms-example.component.html',
  styleUrls: ['./select-reactive-forms-example.component.css']
})
export class SelectReactiveFormsExampleComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false
    });
  }
}
