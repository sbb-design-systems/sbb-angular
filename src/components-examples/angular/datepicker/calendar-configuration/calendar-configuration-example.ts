import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbCalendarCellClassFunction } from '@sbb-esta/angular/datepicker';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

/**
 * @title Standalone Calendar
 * @order 60
 */
@Component({
  selector: 'sbb-calendar-configuration-example',
  templateUrl: 'calendar-configuration-example.html',
  styleUrls: ['calendar-configuration-example.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    SbbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbCheckboxModule,
    SbbButtonModule,
    AsyncPipe,
  ],
})
export class CalendarConfigurationExample implements OnDestroy {
  private _formBuilder = inject(FormBuilder);

  dateRange = new BehaviorSubject<{ start: Date; end: Date } | null>(null);
  dateForm = this._formBuilder.group({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    selectedWeekDay: new FormControl(0),
  });
  selectedDate: Date | null;
  selectedWeekday: number | null;
  showWeekNumbers = true;
  dateClass: Observable<SbbCalendarCellClassFunction<Date>> =
    this.dateForm.controls.selectedWeekDay.valueChanges.pipe(
      startWith(this.dateForm.controls.selectedWeekDay.value),
      map((value) => (date: Date) => (date.getDay() === value ? 'example-custom-date-class' : '')),
    );

  filterStartDate = (date: Date | null): boolean =>
    !this.dateForm.controls.endDate.value || !date || date < this.dateForm.controls.endDate.value;

  filterEndDate = (date: Date | null): boolean =>
    !this.dateForm.controls.startDate.value ||
    !date ||
    date > this.dateForm.controls.startDate.value;

  protected readonly _destroyed: Subject<void> = new Subject<void>();

  constructor() {
    this.dateForm.valueChanges
      .pipe(
        takeUntil(this._destroyed),
        filter(({ startDate, endDate }) => !!startDate && !!endDate),
      )
      .subscribe(({ startDate, endDate }) => {
        if (startDate!.getTime() === endDate!.getTime()) {
          this.selectedDate = startDate!;
        }
        this.dateRange.next({ start: startDate!, end: endDate! });
      });
  }

  onWeekSelection(selection: { week: number; start: Date; end: Date } | null) {
    if (selection) {
      this.selectedDate = null;
      this.dateRange.next({ start: selection.start, end: selection.end });
      this.dateForm.patchValue({ startDate: selection.start, endDate: selection.end });
    }
  }

  onWeekdaySelection(weekday: number | null) {
    this.dateForm.controls.selectedWeekDay.patchValue(weekday);
  }

  clearSelection() {
    this.selectedWeekday = null;
    this.selectedDate = null;
    this.dateRange.next(null);
    this.dateForm.reset();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
