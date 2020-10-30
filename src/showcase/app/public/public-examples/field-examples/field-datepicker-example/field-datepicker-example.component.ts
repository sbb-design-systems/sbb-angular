import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-field-datepicker-example',
  templateUrl: './field-datepicker-example.component.html',
})
export class FieldDatepickerExampleComponent {
  date: FormControl = new FormControl(new Date(), [Validators.required]);
}
