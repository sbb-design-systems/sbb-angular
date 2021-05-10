import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * @title Datepicker Date Range
 * @order 20
 */
@Component({
  selector: 'sbb-datepicker-date-range-example',
  templateUrl: './datepicker-date-range-example.html',
})
export class DatepickerDateRangeExample {
  twoDatepickersForm = new FormGroup({
    firstDatepicker: new FormControl(),
    secondDatepicker: new FormControl(),
  });
}
