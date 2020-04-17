import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-datepicker-date-filter-example',
  templateUrl: './datepicker-date-filter-example.component.html'
})
export class DatepickerDateFilterExampleComponent {
  dateWithFilter = new FormControl();

  filterDates = (date: Date): boolean => {
    return date.getDate() === 1;
  };
}
