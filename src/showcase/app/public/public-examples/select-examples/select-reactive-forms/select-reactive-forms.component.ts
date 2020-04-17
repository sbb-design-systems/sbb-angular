import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-reactive-forms',
  templateUrl: './select-reactive-forms.component.html',
  styleUrls: ['./select-reactive-forms.component.css']
})
export class SelectReactiveFormsComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false
    });
  }
}
