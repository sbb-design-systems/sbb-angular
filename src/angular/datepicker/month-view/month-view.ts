import {
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDateAdapter, SbbDateFormats, SBB_DATE_FORMATS, TypeRef } from '@sbb-esta/angular/core';

import { SbbCalendarBody, SbbCalendarCell } from '../calendar-body/calendar-body';
import { SbbDateRange } from '../date-range';
import { createMissingDateImplError } from '../datepicker-errors';
import { SBB_DATEPICKER } from '../datepicker-token';
import type { SbbDatepicker } from '../datepicker/datepicker';

const DAYS_PER_WEEK = 7;

@Component({
  selector: 'sbb-month-view',
  templateUrl: './month-view.html',
  exportAs: 'sbbMonthView',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbMonthView<D> implements AfterContentInit {
  /** The date to display in this month view (everything other than the month and year is ignored). */
  @Input()
  get activeDate(): D {
    return this._activeDate;
  }
  set activeDate(value: D) {
    const oldActiveDate = this._activeDate;
    const validDate =
      this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
    this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
    if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
      this.init();
    }
  }
  private _activeDate: D;

  /** The currently selected date. */
  @Input()
  get selected(): D | null {
    return this._selected;
  }
  set selected(value: D | null) {
    this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this.selectedDate = this._getDateInCurrentMonth(this._selected);
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

  /** Emits when a new date is selected. */
  @Output()
  readonly selectedChange: EventEmitter<D | null> = new EventEmitter<D | null>();

  /** Emits when any date is selected. */
  @Output() readonly userSelection: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when any date is activated. */
  @Output() readonly activeDateChange: EventEmitter<D> = new EventEmitter<D>();

  /** The body of calendar table */
  @ViewChild(SbbCalendarBody, { static: true }) sbbCalendarBody: SbbCalendarBody;

  /** The label for this month (e.g. "January 2017"). */
  monthLabel: string;

  /** Grid of calendar cells representing the dates of the month. */
  weeks: SbbCalendarCell[][];

  /** The number of blank cells in the first row before the 1st of the month. */
  firstWeekOffset: number;

  /**
   * The date of the month that the currently selected Date falls on.
   * Null if the currently selected Date is in another month.
   */
  selectedDate: number | null;

  /** The date of the month that today falls on. Null if today is in another month. */
  todayDate: number | null;

  /** The names of the weekdays. */
  weekdays: { long: string; narrow: string }[];

  /** Currently active date range. */
  dateRange: SbbDateRange<D> | null = null;

  constructor(
    @Optional() public _dateAdapter: SbbDateAdapter<D>,
    @Inject(LOCALE_ID) public readonly locale: string,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: SbbDateFormats,
    @Optional() @Inject(SBB_DATEPICKER) datepicker: TypeRef<SbbDatepicker<D>>
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }
    if (
      datepicker &&
      datepicker.connected &&
      datepicker.datepickerInput.value &&
      datepicker.connected.datepickerInput.value
    ) {
      this.dateRange = new SbbDateRange(
        datepicker.datepickerInput.value,
        datepicker.connected.datepickerInput.value
      );
    } else if (
      datepicker &&
      datepicker.main &&
      datepicker.datepickerInput.value &&
      datepicker.main.datepickerInput.value
    ) {
      this.dateRange = new SbbDateRange(
        datepicker.main.datepickerInput.value,
        datepicker.datepickerInput.value
      );
    }

    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');

    // Rotate the labels for days of the week based on the configured first day of the week.
    const weekdays = longWeekdays.map((long, i) => {
      return { long, narrow: narrowWeekdays[i] };
    });
    this.weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));

    this._activeDate = this._dateAdapter.today();
  }

  ngAfterContentInit() {
    this.init();
  }

  /** Handles when a new date is selected. */
  dateSelected(date: number) {
    if (this.selectedDate !== date) {
      const selectedYear = this._dateAdapter.getYear(this.activeDate);
      const selectedMonth = this._dateAdapter.getMonth(this.activeDate);
      const selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);

      this.selectedChange.emit(selectedDate);
    }

    this.userSelection.emit();
  }

  /** Handles keydown events on the calendar body when calendar is in month view. */
  handleCalendarBodyKeydown(event: KeyboardEvent): void {
    const oldActiveDate = this._activeDate;

    switch (event.keyCode) {
      case LEFT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -1);
        break;
      case RIGHT_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1);
        break;
      case UP_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
        break;
      case DOWN_ARROW:
        this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
        break;
      case HOME:
        this.activeDate = this._dateAdapter.addCalendarDays(
          this._activeDate,
          1 - this._dateAdapter.getDate(this._activeDate)
        );
        break;
      case END:
        this.activeDate = this._dateAdapter.addCalendarDays(
          this._activeDate,
          this._dateAdapter.getNumDaysInMonth(this._activeDate) -
            this._dateAdapter.getDate(this._activeDate)
        );
        break;
      case PAGE_UP:
        this.activeDate = event.altKey
          ? this._dateAdapter.addCalendarYears(this._activeDate, -1)
          : this._dateAdapter.addCalendarMonths(this._activeDate, -1);
        break;
      case PAGE_DOWN:
        this.activeDate = event.altKey
          ? this._dateAdapter.addCalendarYears(this._activeDate, 1)
          : this._dateAdapter.addCalendarMonths(this._activeDate, 1);
        break;
      case ENTER:
        if (!this.dateFilter || this.dateFilter(this._activeDate)) {
          this.dateSelected(this._dateAdapter.getDate(this._activeDate));
          this.userSelection.emit();
          // Prevent unexpected default actions such as form submission.
          event.preventDefault();
        }
        return;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this.activeDate);
    }

    this.focusActiveCell();
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /** Initializes this month view. */
  init() {
    this.selectedDate = this._getDateInCurrentMonth(this.selected);
    this.todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
    this.monthLabel = this._dateAdapter
      .getMonthNames('short')
      [this._dateAdapter.getMonth(this.activeDate)].toLocaleUpperCase();

    const firstOfMonth = this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate),
      1
    );
    this.firstWeekOffset =
      (DAYS_PER_WEEK +
        this._dateAdapter.getDayOfWeek(firstOfMonth) -
        this._dateAdapter.getFirstDayOfWeek()) %
      DAYS_PER_WEEK;

    this._createWeekCells();
    this._changeDetectorRef.markForCheck();
  }

  /** Focuses the active cell after the microtask queue is empty. */
  focusActiveCell() {
    this.sbbCalendarBody.focusActiveCell();
  }

  /** Creates MatCalendarCells for the dates in this month. */
  private _createWeekCells() {
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
    const dateNames = this._dateAdapter.getDateNames();
    this.weeks = [[]];
    for (let i = 0, cell = this.firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell === DAYS_PER_WEEK) {
        this.weeks.push([]);
        cell = 0;
      }
      const date = this._dateAdapter.createDate(
        this._dateAdapter.getYear(this.activeDate),
        this._dateAdapter.getMonth(this.activeDate),
        i + 1
      );
      const enabled = this._shouldEnableDate(date);
      const ariaLabel = this._dateAdapter.format(date, this._dateFormats.dateA11yLabel);
      const rangeBackground = this._shouldApplyRangeBackground(date);
      this.weeks[this.weeks.length - 1].push(
        new SbbCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, rangeBackground)
      );
    }
  }

  private _shouldApplyRangeBackground(date: D): string | null {
    if (
      this.dateRange &&
      this.dateRange.start &&
      this.dateRange.end &&
      !this._dateAdapter.sameDate(this.dateRange.start, this.dateRange.end)
    ) {
      if (
        this._dateAdapter.compareDate(date, this.dateRange.start) > 0 &&
        this._dateAdapter.compareDate(date, this.dateRange.end) < 0
      ) {
        return 'range';
      }
      return this._isRangeLimit(date);
    }
    return null;
  }

  private _isRangeLimit(date: D) {
    if (this._dateAdapter.compareDate(date, this.dateRange!.start) === 0) {
      return 'begin';
    } else if (this._dateAdapter.compareDate(date, this.dateRange!.end) === 0) {
      return 'end';
    } else {
      return null;
    }
  }

  /** Date filter for the month */
  private _shouldEnableDate(date: D): boolean {
    return (
      !!date &&
      (!this.dateFilter || this.dateFilter(date)) &&
      (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
      (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0)
    );
  }

  /**
   * Gets the date in this month that the given Date falls on.
   * Returns null if the given Date is in another month.
   */
  private _getDateInCurrentMonth(date: D | null): number | null {
    return date && this._hasSameMonthAndYear(date, this.activeDate)
      ? this._dateAdapter.getDate(date)
      : null;
  }

  /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
  private _hasSameMonthAndYear(d1: D | null, d2: D | null): boolean {
    return !!(
      d1 &&
      d2 &&
      this._dateAdapter.getMonth(d1) === this._dateAdapter.getMonth(d2) &&
      this._dateAdapter.getYear(d1) === this._dateAdapter.getYear(d2)
    );
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj) ? obj : null;
  }
}
