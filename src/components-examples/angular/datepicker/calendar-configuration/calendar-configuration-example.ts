import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { SbbCalendarCellClassFunction } from '@sbb-esta/angular/datepicker';
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
  styleUrls: ['calendar-configuration-example.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarConfigurationExample implements OnDestroy {
  dateRange = new BehaviorSubject<{ start: Date; end: Date } | null>(null);
  dateForm = this._formBuilder.group({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
  });
  selectedDate: Date | null;
  showWeekNumbers = true;
  dateClass: SbbCalendarCellClassFunction<Date> = (date) => {
    // Highlight 6th day of the week (Sunday)
    return date.getDay() === 0 ? 'example-custom-date-class' : '';
  };

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

  onWeekSelection(selection: { week: number; start: Date; end: Date } | null) {
    if (selection) {
      this.dateRange.next({ start: selection.start, end: selection.end });
      this.dateForm.patchValue({ startDate: selection.start, endDate: selection.end });
    }
  }

  clearSelection() {
    this.selectedDate = null;
    this.dateRange.next(null);
    this.dateForm.reset();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
