// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDateAdapter, SbbDateFormats, SBB_DATE_FORMATS } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';

import { createMissingDateImplError } from '../datepicker-errors';
import { SbbMonthView } from '../month-view/month-view';

@Component({
  selector: 'sbb-calendar-header',
  exportAs: 'sbbCalendarHeader',
  templateUrl: './calendar-header.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-calendar-header sbb-icon-scaled',
  },
})
export class SbbCalendarHeader<D> {
  _labelSwitchToPreviousMonth: string = $localize`:Button label to switch to the previous month@@sbbDatepickerSwitchToPreviousMonth:Change to the previous month`;

  _labelSwitchToNextMonth: string = $localize`:Button label to switch to the next month@@sbbDatepickerSwitchToNextMonth:Change to the next month`;

  _labelSwitchToPreviousYear: string = $localize`:Button label to switch to the previous year@@sbbDatepickerSwitchToPreviousYear:Change to the previous year`;

  _labelSwitchToNextYear: string = $localize`:Button label to switch to the next year@@sbbDatepickerSwitchToNextYear:Change to the next year`;

  public calendar: SbbCalendar<D>;

  constructor(
    @Optional() private _dateAdapter: SbbDateAdapter<D>,
    // tslint:disable-next-line:no-use-before-declare
    @Inject(forwardRef(() => SbbCalendar))
    calendar: any,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.calendar = calendar;
    this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
  }

  /** The label for the current calendar view. */
  get monthText(): string {
    return this._dateAdapter.getMonthName(this.calendar.activeDate);
  }

  /** The label for the current calendar view. */
  get yearText(): string {
    return this._dateAdapter.getYearName(this.calendar.activeDate);
  }

  /** Handles user clicks on the previous button. */
  previousMonthClicked(): void {
    const newActiveDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
    this._assignActiveDate(newActiveDate);
  }

  /** Handles user clicks on the next button. */
  nextMonthClicked(): void {
    const newActiveDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
    this._assignActiveDate(newActiveDate);
  }

  /** Whether the previous period button is enabled. */
  previousMonthEnabled(): boolean {
    return (
      !this.calendar.minDate ||
      !this._isSameMonthView(this.calendar.activeDate, this.calendar.minDate)
    );
  }

  /** Whether the next period button is enabled. */
  nextMonthEnabled(): boolean {
    return (
      !this.calendar.maxDate ||
      !this._isSameMonthView(this.calendar.activeDate, this.calendar.maxDate)
    );
  }

  /** Whether the two dates represent the same month. */
  private _isSameMonthView(date1: D, date2: D): boolean {
    return (
      this._dateAdapter.getYear(date1) === this._dateAdapter.getYear(date2) &&
      this._dateAdapter.getMonth(date1) === this._dateAdapter.getMonth(date2)
    );
  }

  /** Handles user clicks on the previous button. */
  previousYearClicked(): void {
    const newActiveDate = this._dateAdapter.addCalendarYears(this.calendar.activeDate, -1);
    this._assignActiveDate(newActiveDate);
  }

  /** Handles user clicks on the next button. */
  nextYearClicked(): void {
    const newActiveDate = this._dateAdapter.addCalendarYears(this.calendar.activeDate, 1);
    this._assignActiveDate(newActiveDate);
  }

  /** Whether the previous period button is enabled. */
  previousYearEnabled(): boolean {
    return (
      !this.calendar.minDate ||
      !this._isSameYearView(this.calendar.activeDate, this.calendar.minDate)
    );
  }

  /** Whether the next period button is enabled. */
  nextYearEnabled(): boolean {
    return (
      !this.calendar.maxDate ||
      !this._isSameYearView(this.calendar.activeDate, this.calendar.maxDate)
    );
  }

  /** Whether the two dates represent the same month. */
  private _isSameYearView(date1: D, date2: D): boolean {
    return this._dateAdapter.getYear(date1) === this._dateAdapter.getYear(date2);
  }

  private _assignActiveDate(date: D) {
    if (this.calendar.minDate && this._dateAdapter.compareDate(this.calendar.minDate, date) > 0) {
      this.calendar.activeDate = this.calendar.minDate;
    } else if (
      this.calendar.maxDate &&
      this._dateAdapter.compareDate(this.calendar.maxDate, date) < 0
    ) {
      this.calendar.activeDate = this.calendar.maxDate;
    } else {
      this.calendar.activeDate = date;
    }
  }
}

/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
@Component({
  selector: 'sbb-calendar',
  templateUrl: 'calendar.html',
  exportAs: 'sbbCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-calendar',
  },
})
export class SbbCalendar<D> implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {
  /** An input indicating the type of the header component, if set. */
  @Input() headerComponent: ComponentType<any>;

  /** A portal containing the header component type for this calendar. */
  calendarHeaderPortal: Portal<any>;

  /**
   * Used for scheduling that focus should be moved to the active cell on the next tick.
   * We need to schedule it, rather than do it immediately, because we have to wait
   * for Angular to re-evaluate the view children.
   */
  private _moveFocusOnNextTick = false;

  /** A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt(): D | null {
    return this._startAt;
  }
  set startAt(value: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /** The currently selected date. */
  @Input()
  get selected(): D | null {
    return this._selected;
  }
  set selected(value: D | null) {
    this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _selected: D | null;

  /** The minimum selectable date. */
  @Input()
  get minDate(): D | null {
    return this._minDate;
  }
  set minDate(value: D | null) {
    this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _minDate: D | null;

  /** The maximum selectable date. */
  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }
  set maxDate(value: D | null) {
    this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _maxDate: D | null;

  /** A function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D) => boolean;

  /** Emits when the currently selected date changes. */
  @Output() readonly selectedChange: EventEmitter<D> = new EventEmitter<D>();

  /** Emits when any date is selected. */
  @Output() readonly userSelection: EventEmitter<void> = new EventEmitter<void>();

  /** Reference to the current month view component. */
  @ViewChild(SbbMonthView, { static: true }) monthView: SbbMonthView<D>;

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get activeDate(): D {
    return this._clampedActiveDate;
  }
  set activeDate(value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
    this.stateChanges.next();
  }
  private _clampedActiveDate: D;

  /** Emits whenever there is a state change that the header may need to respond to. */
  stateChanges: Subject<void> = new Subject<void>();

  constructor(
    @Optional() private _dateAdapter: SbbDateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: SbbDateFormats,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }
  }

  ngAfterContentInit() {
    this.calendarHeaderPortal = new ComponentPortal(this.headerComponent || SbbCalendarHeader);
    this.activeDate = this.startAt || this._dateAdapter.today();
  }

  ngAfterViewChecked() {
    if (this._moveFocusOnNextTick) {
      this._moveFocusOnNextTick = false;
      this.focusActiveCell();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Ignore date changes that are at a different time on the same day. This fixes issues where
    // the calendar re-renders when there is no meaningful change to [minDate] or [maxDate]
    // (angular/components#24435).
    const minDateChange: SimpleChange | undefined =
      changes['minDate'] &&
      !this._dateAdapter.sameDate(changes['minDate'].previousValue, changes['minDate'].currentValue)
        ? changes['minDate']
        : undefined;
    const maxDateChange: SimpleChange | undefined =
      changes['maxDate'] &&
      !this._dateAdapter.sameDate(changes['maxDate'].previousValue, changes['maxDate'].currentValue)
        ? changes['maxDate']
        : undefined;

    const change = minDateChange || maxDateChange || changes['dateFilter'];

    if (change && !change.firstChange) {
      const view = this._getCurrentViewComponent();

      if (view) {
        // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
        // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
        this._changeDetectorRef.detectChanges();
        view.init();
      }
    }

    this.stateChanges.next();
  }

  focusActiveCell() {
    this._getCurrentViewComponent().focusActiveCell();
  }

  /** Handles date selection in the month view. */
  dateSelected(date: D | null): void {
    if (date && !this._dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }
  }

  userSelected(): void {
    this.userSelection.emit();
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj) ? obj : null;
  }

  /** Returns the component instance that corresponds to the current calendar view. */
  private _getCurrentViewComponent() {
    return this.monthView;
  }
}
