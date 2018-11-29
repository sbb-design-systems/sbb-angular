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
  maxDate = new Date('2018-12-28');

  laData = new FormControl(this.today);

  dateWithFilter = new FormControl();

  withoutToggle = false;
  get withArrows(): boolean {
    return this._withArrows;
  }
  set withArrows(useArrows: boolean) {
    this._withArrows = useArrows;
  }
  private _withArrows = false;

  onlyInput($event) {
    if ($event.target.checked) {
      this.withoutToggle = true;
      this.withArrows = false;
    } else {
      this.withoutToggle = false;
      this.withArrows = true;
    }
  }

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

  filterDates(date: Date) : boolean {
    return date.getDate() === 1;
  }
}
