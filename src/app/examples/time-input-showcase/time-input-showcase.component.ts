import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-time-input-showcase',
  templateUrl: './time-input-showcase.component.html',
  styleUrls: ['./time-input-showcase.component.scss']
})
export class TimeInputShowcaseComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      time: []
    });
  }
}
