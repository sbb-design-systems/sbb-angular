import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-time-input-form-example',
  templateUrl: './time-input-form-example.component.html',
})
export class TimeInputFormExampleComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      time: '',
    });
  }
}
