import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-form-field-datepicker-example',
  templateUrl: './form-field-datepicker-example.component.html',
})
export class FormFieldDatepickerExampleComponent {
  date: FormControl = new FormControl(new Date(), [Validators.required]);
}
