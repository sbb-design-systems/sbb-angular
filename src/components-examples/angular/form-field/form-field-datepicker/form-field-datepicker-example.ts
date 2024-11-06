import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Datepicker
 * @order 50
 */
@Component({
  selector: 'sbb-form-field-datepicker-example',
  templateUrl: 'form-field-datepicker-example.html',
  imports: [
    SbbFormFieldModule,
    SbbDatepickerModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FormFieldDatepickerExample {
  date: FormControl = new FormControl(new Date(), [Validators.required]);
}
