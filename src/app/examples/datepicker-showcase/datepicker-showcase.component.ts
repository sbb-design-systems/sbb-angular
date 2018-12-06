import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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

  twoDatepickersForm = new FormGroup(
    {
      firstDatepicker: new FormControl(),
      secondDatepicker: new FormControl()
    }
  );

  withoutToggle = false;
  get withArrows(): boolean {
    return this._withArrows;
  }
  set withArrows(useArrows: boolean) {
    this._withArrows = useArrows;
  }
  private _withArrows = false;

  withoutToggleDisabled = false;
  withArrowsDisabled = false;

  onlyInput($event) {
    if ($event.target.checked) {
      this.withoutToggle = true;
      this.withArrows = false;
      this.withoutToggleDisabled = true;
      this.withArrowsDisabled = true;
    } else {
      this.withoutToggle = false;
      this.withArrows = true;
      this.withoutToggleDisabled = false;
      this.withArrowsDisabled = false;
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

  filterDates(date: Date): boolean {
    return date.getDate() === 1;
  }
}
