import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SbbDateAdapter } from '@sbb-esta/angular/core';
import { SbbDateInputEvent } from '@sbb-esta/angular/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @title Datepicker Simple Reactive
 * @order 10
 */
@Component({
  selector: 'sbb-datepicker-simple-reactive-example',
  templateUrl: 'datepicker-simple-reactive-example.html',
})
export class DatepickerSimpleReactiveExample implements OnDestroy {
  date = new FormControl(new Date());

  minDate = new FormControl<Date | null>(null);
  maxDate = new FormControl<Date | null>(null);

  toggle = new FormControl(true);
  arrows = new FormControl(false);
  disabled = new FormControl(false);
  readonly = new FormControl(false);

  private _destroyed = new Subject<void>();

  constructor(dateAdapter: SbbDateAdapter<Date>) {
    this.minDate.setValue(dateAdapter.addCalendarMonths(dateAdapter.today(), -6));
    this.maxDate.setValue(dateAdapter.addCalendarMonths(dateAdapter.today(), 6));

    this.disabled.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((value) => (value ? this.date.disable() : this.date.enable()));
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
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
