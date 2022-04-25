import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * @title Datepicker Date Range
 * @order 20
 */
@Component({
  selector: 'sbb-datepicker-date-range-example',
  templateUrl: 'datepicker-date-range-example.html',
})
export class DatepickerDateRangeExample {
  start = new UntypedFormControl();
  end = new UntypedFormControl();
}
