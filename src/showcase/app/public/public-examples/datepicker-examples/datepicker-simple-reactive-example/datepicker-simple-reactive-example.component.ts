import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SbbDateAdapter } from '@sbb-esta/angular-core/datetime';
import { SbbDateInputEvent } from '@sbb-esta/angular-public/datepicker';

@Component({
  selector: 'sbb-datepicker-simple-reactive-example',
  templateUrl: './datepicker-simple-reactive-example.component.html',
})
export class DatepickerSimpleReactiveExampleComponent {
  formGroup = new FormGroup({ date: new FormControl(new Date()) });

  minDate: Date;
  maxDate: Date;

  toggle = true;
  arrows = false;
  disabled = false;

  constructor(dateAdapter: SbbDateAdapter<Date>) {
    this.minDate = dateAdapter.addCalendarMonths(dateAdapter.today(), -6);
    this.maxDate = dateAdapter.addCalendarMonths(dateAdapter.today(), 6);
  }

  async onDisabled() {
    // Wait a tick to ensure this.disabled is updated
    await Promise.resolve();
    if (this.disabled) {
      this.formGroup.get('date').disable();
    } else {
      this.formGroup.get('date').enable();
    }
  }

  closedEvent() {
    console.log('CLOSED');
  }

  openedEvent() {
    console.log('OPENED');
  }

  dateChangeEvent($event: SbbDateInputEvent<Date>) {
    console.log('DATE_CHANGED', $event);
  }

  dateInputEvent($event: SbbDateInputEvent<Date>) {
    console.log('DATE_INPUT', $event);
  }
}
