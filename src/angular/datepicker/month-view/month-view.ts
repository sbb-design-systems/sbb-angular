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
  inject,
  Input,
  LOCALE_ID,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbDateAdapter, SbbDateFormats, SBB_DATE_FORMATS, TypeRef } from '@sbb-esta/angular/core';

import {
  SbbCalendarBody,
  SbbCalendarCell,
  SbbCalendarCellClassFunction,
} from '../calendar-body/calendar-body';
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
  standalone: true,
  imports: [SbbCalendarBody],
})
export class SbbMonthView<D> implements AfterContentInit {
  _dateAdapter: SbbDateAdapter<D> = inject<SbbDateAdapter<D>>(SbbDateAdapter, {
    optional: true,
  })!;
  readonly locale = inject(LOCALE_ID);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _dateFormats = inject<SbbDateFormats>(SBB_DATE_FORMATS, { optional: true })!;

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

  /** Function that can be used to add custDom CSS classes to dates. */
  @Input()
  get dateClass(): SbbCalendarCellClassFunction<D> | null {
    return this._dateClass;
  }
  set dateClass(dateClass: SbbCalendarCellClassFunction<D> | null) {
    this._dateClass = dateClass;
    this._updateDateClasses();
  }
  _dateClass: SbbCalendarCellClassFunction<D> | null;

  /** Whether to display the week number. */
  @Input() showWeekNumbers: boolean = false;

  /** Whether the week can be selected. */
  @Input() isWeekSelectable: boolean = false;

  /** Whether the weekday can be selected. */
  @Input() isWeekdaySelectable: boolean = false;

  /** Emits when a new date is selected. */
  @Output()
  readonly selectedChange: EventEmitter<D | null> = new EventEmitter<D | null>();

  /** Emits when a new week is selected. */
  @Output()
  readonly selectedWeekChange: EventEmitter<{
    week: number;
    rangeInMonth: SbbDateRange<D>;
  } | null> = new EventEmitter();

  /** Emits when a weekday is selected. */
  @Output() readonly selectedWeekdayChange: EventEmitter<number> = new EventEmitter<number>();

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

  /** Week of year for each row. */
  weeksInMonth: number[] = [];

  /** The number of blank cells in the first row before the 1st of the month. */
  firstWeekOffset: number;

  /**
   * The date of the month that the currently selected Date falls on.
   * Null if the currently selected Date is in another month.
   */
  selectedDate: number | null;

  /**
   * The weekday that is currently selected.
   */
  selectedWeekday: number | null;

  /** The date of the month that today falls on. Null if today is in another month. */
  todayDate: number | null;

  /** The names of the weekdays. */
  weekdays: { long: string; narrow: string; index: number }[];

  /** Currently active date range. */
  @Input()
  get dateRange() {
    return this._dateRange;
  }
  set dateRange(dateRange) {
    this._dateRange = dateRange;
    this._updateRangeBackground();
  }
  private _dateRange: SbbDateRange<D> | null = null;

  private _datePicker: SbbDatepicker<D>;

  constructor(...args: unknown[]);
  constructor() {
    const datepicker = inject<TypeRef<SbbDatepicker<D>>>(SBB_DATEPICKER, { optional: true })!;

    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }

    this._datePicker = datepicker;

    const firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
    const narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
    const longWeekdays = this._dateAdapter.getDayOfWeekNames('long');

    // Rotate the labels for days of the week based on the configured first day of the week.
    const weekdays = longWeekdays.map((long, i) => {
      return { long, narrow: narrowWeekdays[i], index: i };
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
      const selectedDate = this._getDateFromDayOfMonth(date);

      this.selectedChange.emit(selectedDate);
    }

    this.userSelection.emit();
  }

  /** Handles week selection */
  weekSelected(week: number) {
    const weekIndex = this.weeksInMonth.findIndex((w) => w === week);
    if (weekIndex < 0 || weekIndex >= this.weeks.length) {
      return;
    }

    const selectedWeek = this.weeks[weekIndex];
    this.selectedWeekChange.emit({
      week,
      rangeInMonth: new SbbDateRange(
        this._getDateFromDayOfMonth(selectedWeek[0].value),
        this._getDateFromDayOfMonth(selectedWeek[selectedWeek.length - 1].value),
      ),
    });
  }

  /** Handles weekday selection. */
  weekdaySelected(weekday: number) {
    if (this.selectedWeekday !== weekday) {
      this.selectedWeekdayChange.emit(weekday);
    }
  }

  /**
   * Takes the index of a calendar body cell wrapped in an event as argument. For the date that
   * corresponds to the given cell, set `activeDate` to that date and fire `activeDateChange` with
   * that date.
   *
   * This function is used to match each component's model of the active date with the calendar
   * body cell that was focused. It updates its value of `activeDate` synchronously and updates the
   * parent's value asynchronously via the `activeDateChange` event. The child component receives an
   * updated value asynchronously via the `activeCell` Input.
   */
  _updateActiveDate(month: number) {
    const oldActiveDate = this._activeDate;
    this.activeDate = this._getDateFromDayOfMonth(month);

    if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
      this.activeDateChange.emit(this._activeDate);
    }
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
          1 - this._dateAdapter.getDate(this._activeDate),
        );
        break;
      case END:
        this.activeDate = this._dateAdapter.addCalendarDays(
          this._activeDate,
          this._dateAdapter.getNumDaysInMonth(this._activeDate) -
            this._dateAdapter.getDate(this._activeDate),
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
      this._focusActiveCellAfterViewChecked();
    }

    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /** Initializes this month view. */
  init() {
    const datepicker = this._datePicker;
    if (
      datepicker &&
      datepicker.connected &&
      datepicker.datepickerInput.value &&
      datepicker.connected.datepickerInput.value
    ) {
      this._dateRange = new SbbDateRange(
        datepicker.datepickerInput.value,
        datepicker.connected.datepickerInput.value,
      );
    } else if (
      datepicker &&
      datepicker.main &&
      datepicker.datepickerInput.value &&
      datepicker.main.datepickerInput.value
    ) {
      this._dateRange = new SbbDateRange(
        datepicker.main.datepickerInput.value,
        datepicker.datepickerInput.value,
      );
    }

    this.selectedDate = this._getDateInCurrentMonth(this.selected);
    this.todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
    this.monthLabel = this._dateAdapter
      .getMonthNames('short')
      [this._dateAdapter.getMonth(this.activeDate)].toLocaleUpperCase();

    const firstOfMonth = this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate),
      1,
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

  /** Focuses the active cell after change detection has run and the microtask queue is empty. */
  _focusActiveCellAfterViewChecked() {
    this.sbbCalendarBody._scheduleFocusActiveCellAfterViewChecked();
  }

  /**
   * Takes a day of the month and returns a new date in the same month and year as the currently
   *  active date. The returned date will have the same day of the month as the argument date.
   */
  private _getDateFromDayOfMonth(dayOfMonth: number): D {
    return this._dateAdapter.createDate(
      this._dateAdapter.getYear(this.activeDate),
      this._dateAdapter.getMonth(this.activeDate),
      dayOfMonth,
    );
  }

  /** Creates MatCalendarCells for the dates in this month. */
  private _createWeekCells() {
    const daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
    const dateNames = this._dateAdapter.getDateNames();
    const month = this._dateAdapter.getMonth(this.activeDate);
    const year = this._dateAdapter.getYear(this.activeDate);
    this.weeks = [[]];
    this.weeksInMonth = [];

    // The angular datepipe does not take the firstDayOfWeek into account.
    // Issue: https://github.com/angular/angular/issues/39606
    // Stackblitz: https://stackblitz.com/edit/angular-ivy-k6rjgv
    // As a consequence, if the firstDayOfWeek is 1 (Monday) and the first day of month
    // is a Sunday (0) the calculation of week numbers does not work as expected.
    // The following workaround fixes this issue.
    const isFirstDayASunday =
      this._dateAdapter.getFirstDayOfWeek() === 1 && this.firstWeekOffset === 6;

    for (let i = 0, cell = this.firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell === DAYS_PER_WEEK) {
        this.weeks.push([]);
        cell = 0;
      }
      const date = this._dateAdapter.createDate(year, month, i + 1);
      if (i === 0 || cell === 0) {
        if (i === 0 && isFirstDayASunday) {
          const prevDate = this._dateAdapter.addCalendarDays(date, -1);
          this.weeksInMonth.push(parseInt(this._dateAdapter.format(prevDate, 'w'), 10));
        } else {
          this.weeksInMonth.push(parseInt(this._dateAdapter.format(date, 'w'), 10));
        }
      }
      const enabled = this._shouldEnableDate(date);
      const ariaLabel = this._dateAdapter.format(date, this._dateFormats.dateA11yLabel);
      const rangeBackground = this._shouldApplyRangeBackground(date);
      const cellClasses = this._dateClass ? this._dateClass(date) : undefined;

      this.weeks[this.weeks.length - 1].push(
        new SbbCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, rangeBackground, cellClasses),
      );
    }
  }

  private _updateDateClasses() {
    let isUpdated = false;
    const year = this._dateAdapter.getYear(this.activeDate);
    const month = this._dateAdapter.getMonth(this.activeDate);
    if (this.weeks) {
      for (let i = 0; i < this.weeks.length; i++) {
        for (let j = 0; j < this.weeks[i].length; j++) {
          const date = this._dateAdapter.createDate(year, month, this.weeks[i][j].value);
          const cellClasses = this._dateClass ? this._dateClass(date) : undefined;
          isUpdated = isUpdated || this.weeks[i][j].cssClasses !== cellClasses;
          this.weeks[i][j].cssClasses = cellClasses || {};
        }
      }

      if (isUpdated) {
        this.weeks = [...this.weeks];
      }
    }
  }

  private _updateRangeBackground() {
    let isUpdated = false;
    if (this.weeks) {
      const year = this._dateAdapter.getYear(this.activeDate);
      const month = this._dateAdapter.getMonth(this.activeDate);
      for (let i = 0; i < this.weeks.length; i++) {
        for (let j = 0; j < this.weeks[i].length; j++) {
          const date = this._dateAdapter.createDate(year, month, this.weeks[i][j].value);
          const rangeBackground = this._shouldApplyRangeBackground(date);
          isUpdated = isUpdated || this.weeks[i][j].rangeBackground !== rangeBackground;
          this.weeks[i][j].rangeBackground = rangeBackground;
        }
      }
      if (isUpdated) {
        this.weeks = [...this.weeks];
      }
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
