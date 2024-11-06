import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Datepicker Date Range
 * @order 20
 */
@Component({
  selector: 'sbb-datepicker-date-range-example',
  templateUrl: 'datepicker-date-range-example.html',
  imports: [
    SbbFormFieldModule,
    SbbDatepickerModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
  ],
})
export class DatepickerDateRangeExample {
  start = new FormControl<Date | null>(null);
  end = new FormControl<Date | null>(null);
}
