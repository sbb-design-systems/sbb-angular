import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DateAdapter, DateFormats, SBB_DATE_FORMATS } from '@sbb-esta/angular-core/datetime';
import { Subject } from 'rxjs';

import { createMissingDateImplError } from '../datepicker-errors';
import { MonthViewComponent } from '../month-view/month-view.component';

/**
 * Possible views for the calendar.
 * @docs-private
 */
export type CalendarView = 'month';

@Component({
  selector: 'sbb-calendar-header',
  templateUrl: './calendar-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarHeaderComponent<D> {
  public calendar: CalendarComponent<D>;

  constructor(
    @Optional() private _dateAdapter: DateAdapter<D>,
    // tslint:disable-next-line:no-use-before-declare
    @Inject(forwardRef(() => CalendarComponent))
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

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.calendar.currentView = 'month';
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
  templateUrl: 'calendar.component.html',
  exportAs: 'sbbCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent<D>
  implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {
  @HostBinding('class.sbb-calendar') cssClass = true;

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

  /** Whether the calendar should be started in month or year view. */
  @Input() startView: CalendarView = 'month';

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
  @ViewChild(MonthViewComponent, { static: true }) monthView: MonthViewComponent<D>;

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

  /** Whether the calendar is in month view. */
  get currentView(): CalendarView {
    return this._currentView;
  }
  set currentView(value: CalendarView) {
    this._currentView = value;
    this._moveFocusOnNextTick = true;
  }
  private _currentView: CalendarView;

  /**
   * Emits whenever there is a state change that the header may need to respond to.
   */
  stateChanges = new Subject<void>();

  constructor(
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: DateFormats,
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
    this.calendarHeaderPortal = new ComponentPortal(
      this.headerComponent || CalendarHeaderComponent
    );
    this.activeDate = this.startAt || this._dateAdapter.today();

    // Assign to the private property since we don't want to move focus on init.
    this._currentView = this.startView;
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
    const change = changes.minDate || changes.maxDate || changes.dateFilter;

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
  dateSelected(date: D): void {
    if (!this._dateAdapter.sameDate(date, this.selected)) {
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
