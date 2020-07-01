import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-datepicker-date-range-example',
  templateUrl: './datepicker-date-range-example.component.html',
})
export class DatepickerDateRangeExampleComponent {
  twoDatepickersForm = new FormGroup({
    firstDatepicker: new FormControl(),
    secondDatepicker: new FormControl(),
  });
}
