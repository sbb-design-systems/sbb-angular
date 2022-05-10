import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Datepicker Date Range
 * @order 20
 */
@Component({
  selector: 'sbb-datepicker-date-range-example',
  templateUrl: 'datepicker-date-range-example.html',
})
export class DatepickerDateRangeExample {
  start = new FormControl<Date | null>(null);
  end = new FormControl<Date | null>(null);
}
