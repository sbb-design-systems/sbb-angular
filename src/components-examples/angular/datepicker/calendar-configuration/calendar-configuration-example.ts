import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SbbDateRange } from '@sbb-esta/angular/datepicker/date-range';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * @title Standalone Calendar
 * @order 1
 * TODO: change order to 60
 */
@Component({
  selector: 'sbb-calendar-configuration-example',
  templateUrl: 'calendar-configuration-example.html',
})
export class CalendarConfigurationExample implements OnDestroy {
  dateRange = new BehaviorSubject<SbbDateRange<Date> | null>(null);
  dateForm = this._formBuilder.group({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });
  selectedDate: Date;
  showWeekNumbers = true;

  filterStartDate = (date: Date | null): boolean =>
    !this.dateForm.controls.endDate.value || !date || date < this.dateForm.controls.endDate.value;

  filterEndDate = (date: Date | null): boolean =>
    !this.dateForm.controls.startDate.value ||
    !date ||
    date > this.dateForm.controls.startDate.value;

  protected readonly _destroyed: Subject<void> = new Subject<void>();

  constructor(private _formBuilder: FormBuilder) {
    this.dateForm.valueChanges
      .pipe(
        takeUntil(this._destroyed),
        filter(({ startDate, endDate }) => !!startDate && !!endDate)
      )
      .subscribe(({ startDate, endDate }) => {
        this.dateRange.next({ start: startDate!, end: endDate! });
      });
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
