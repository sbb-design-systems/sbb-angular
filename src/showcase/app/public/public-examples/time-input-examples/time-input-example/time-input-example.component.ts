import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-time-input-example',
  templateUrl: './time-input-example.component.html',
})
export class TimeInputExampleComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      time: [],
    });
  }
}
