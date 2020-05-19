import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-datepicker-master-slave-example',
  templateUrl: './datepicker-master-slave-example.component.html',
})
export class DatepickerMasterSlaveExampleComponent {
  twoDatepickersForm = new FormGroup({
    firstDatepicker: new FormControl(),
    secondDatepicker: new FormControl(),
  });
}
