import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @title Form Field Datepicker
 * @order 50
 */
@Component({
  selector: 'sbb-form-field-datepicker-example',
  templateUrl: './form-field-datepicker-example.html',
})
export class FormFieldDatepickerExample {
  date: FormControl = new FormControl(new Date(), [Validators.required]);
}
