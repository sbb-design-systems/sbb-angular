import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Datepicker Date Filter
 * @order 30
 */
@Component({
  selector: 'sbb-datepicker-date-filter-example',
  templateUrl: './datepicker-date-filter-example.html',
})
export class DatepickerDateFilterExample {
  dateWithFilter = new FormControl();

  filterDates = (date: Date | null): boolean => {
    return date?.getDate() === 1;
  };
}
