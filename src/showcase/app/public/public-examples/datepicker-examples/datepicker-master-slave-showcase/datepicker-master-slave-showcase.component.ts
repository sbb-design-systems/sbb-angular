import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-datepicker-master-slave-showcase',
  templateUrl: './datepicker-master-slave-showcase.component.html'
})
export class DatepickerMasterSlaveShowcaseComponent {
  twoDatepickersForm = new FormGroup({
    firstDatepicker: new FormControl(),
    secondDatepicker: new FormControl()
  });
}
