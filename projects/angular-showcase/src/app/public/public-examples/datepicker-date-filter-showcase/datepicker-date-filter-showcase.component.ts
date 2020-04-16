import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-datepicker-date-filter-showcase',
  templateUrl: './datepicker-date-filter-showcase.component.html'
})
export class DatepickerDateFilterShowcaseComponent {
  dateWithFilter = new FormControl();

  filterDates = (date: Date): boolean => {
    return date.getDate() === 1;
  };
}
