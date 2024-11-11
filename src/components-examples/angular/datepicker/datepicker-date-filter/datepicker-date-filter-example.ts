import { DatePipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Datepicker Date Filter
 * @order 30
 */
@Component({
  selector: 'sbb-datepicker-date-filter-example',
  templateUrl: 'datepicker-date-filter-example.html',
  imports: [
    SbbFormFieldModule,
    SbbDatepickerModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    DatePipe,
  ],
})
export class DatepickerDateFilterExample {
  date = new FormControl<Date | null>(null);

  filterDates = (date: Date | null): boolean => date?.getDate() === 1;
}
