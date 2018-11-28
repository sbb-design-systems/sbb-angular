import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-datepicker-showcase',
  templateUrl: './datepicker-showcase.component.html',
  styleUrls: ['./datepicker-showcase.component.scss']
})
export class DatepickerShowcaseComponent {
  today = new Date();

  minDate = new Date('2018-06-20');
  maxDate = new Date('2018-11-28');

  laData = new FormControl(this.today);

  closedEvent() {
    console.log('CLOSED');
  }

  openedEvent() {
    console.log('OPENED');
  }

  dateChangeEvent($event) {
    console.log('DATE_CHANGED', $event);
  }

  dateInputEvent($event) {
    console.log('DATE_INPUT', $event);
  }
}
