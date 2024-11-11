import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbDateAdapter } from '@sbb-esta/angular/core';
import { SbbDateInputEvent } from '@sbb-esta/angular/datepicker';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @title Datepicker Simple Reactive
 * @order 10
 */
@Component({
  selector: 'sbb-datepicker-simple-reactive-example',
  templateUrl: 'datepicker-simple-reactive-example.html',
  imports: [
    SbbFormFieldModule,
    SbbDatepickerModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    JsonPipe,
    DatePipe,
  ],
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

  constructor() {
    const dateAdapter = inject<SbbDateAdapter<Date>>(SbbDateAdapter);

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
