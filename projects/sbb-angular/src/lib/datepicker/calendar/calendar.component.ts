import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  HostBinding,
  forwardRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DatepickerIntlService } from '../datepicker-intl.service';
import { MonthViewComponent } from '../month-view/month-view.component';
import { DateAdapter } from '../date-adapter';
import { DateFormats, SBB_DATE_FORMATS } from '../date-formats';
import { createMissingDateImplError } from '../datepicker-errors';


/**
 * Possible views for the calendar.
 * @docs-private
 */
export type CalendarView = 'month' | 'year' | 'multi-year';

/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
@Component({
  selector: 'sbb-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.scss'],
  exportAs: 'sbbCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent<D> implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {


  @HostBinding('class')
  cssClass = 'sbb-calendar';

  /** An input indicating the type of the header component, if set. */
  @Input() headerComponent: ComponentType<any>;

  /** A portal containing the header component type for this calendar. */
  _calendarHeaderPortal: Portal<any>;

  private _intlChanges: Subscription;

  /**
   * Used for scheduling that focus should be moved to the active cell on the next tick.
   * We need to schedule it, rather than do it immediately, because we have to wait
   * for Angular to re-evaluate the view children.
   */
  private _moveFocusOnNextTick = false;

  /** A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt(): D | null { return this._startAt; }
  set startAt(value: D | null) {
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /** Whether the calendar should be started in month or year view. */
  @Input() startView: CalendarView = 'month';

  /** The currently selected date. */
  @Input()
  get selected(): D | null { return this._selected; }
  set selected(value: D | null) {
    this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _selected: D | null;

  /** The minimum selectable date. */
  @Input()
  get minDate(): D | null { return this._minDate; }
  set minDate(value: D | null) {
    this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _minDate: D | null;

  /** The maximum selectable date. */
  @Input()
  get maxDate(): D | null { return this._maxDate; }
  set maxDate(value: D | null) {
    this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }
  private _maxDate: D | null;

  /** A function used to filter which dates are selectable. */
  @Input() dateFilter: (date: D) => boolean;

  /** Emits when the currently selected date changes. */
  @Output() readonly selectedChange: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits the year chosen in multiyear view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits the month chosen in year view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /** Emits when any date is selected. */
  @Output() readonly _userSelection: EventEmitter<void> = new EventEmitter<void>();

  /** Reference to the current month view component. */
  @ViewChild(MonthViewComponent) monthView: MonthViewComponent<D>;

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get activeDate(): D { return this._clampedActiveDate; }
  set activeDate(value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
    this.stateChanges.next();
  }
  private _clampedActiveDate: D;

  /** Whether the calendar is in month view. */
  get currentView(): CalendarView { return this._currentView; }
  set currentView(value: CalendarView) {
    this._currentView = value;
    this._moveFocusOnNextTick = true;
  }
  private _currentView: CalendarView;

  /**
   * Emits whenever there is a state change that the header may need to respond to.
   */
  stateChanges = new Subject<void>();

  constructor(_intl: DatepickerIntlService,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: DateFormats,
    private _changeDetectorRef: ChangeDetectorRef) {

    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }

    if (!this._dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }

    this._intlChanges = _intl.changes.subscribe(() => {
      _changeDetectorRef.markForCheck();
      this.stateChanges.next();
    });
  }

  ngAfterContentInit() {
    this._calendarHeaderPortal = new ComponentPortal(this.headerComponent || CalendarHeaderComponent);
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
    this._intlChanges.unsubscribe();
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
        view._init();
      }
    }

    this.stateChanges.next();
  }

  focusActiveCell() {
    this._getCurrentViewComponent()._focusActiveCell();
  }

  /** Handles date selection in the month view. */
  _dateSelected(date: D): void {
    if (!this._dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }
  }

  /** Handles year selection in the multiyear view. */
  _yearSelectedInMultiYearView(normalizedYear: D) {
    this.yearSelected.emit(normalizedYear);
  }

  /** Handles month selection in the year view. */
  _monthSelectedInYearView(normalizedMonth: D) {
    this.monthSelected.emit(normalizedMonth);
  }

  _userSelected(): void {
    this._userSelection.emit();
  }

  /** Handles year/month selection in the multi-year/year views. */
  _goToDateInView(date: D, view: 'month' | 'year' | 'multi-year'): void {
    this.activeDate = date;
    this.currentView = view;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }

  /** Returns the component instance that corresponds to the current calendar view. */
  private _getCurrentViewComponent() {
    return this.monthView;
  }
}

@Component({
  selector: 'sbb-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeaderComponent<D> {
  constructor(private _intl: DatepickerIntlService,
    @Inject(forwardRef(() => CalendarComponent)) public calendar: CalendarComponent<D>,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: DateFormats,
    changeDetectorRef: ChangeDetectorRef) {

    this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
  }

  /** The label for the current calendar view. */
  get periodButtonText(): string {
    if (this.calendar.currentView === 'month') {
      return this._dateAdapter
        .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
        .toLocaleUpperCase();
    }
  }

  get periodButtonLabel(): string {
    return this.calendar.currentView === 'month' ?
      this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
  }

  /** The label for the the previous button. */
  get prevButtonLabel(): string {
    return {
      'month': this._intl.prevMonthLabel,
      'year': this._intl.prevYearLabel,
      'multi-year': this._intl.prevMultiYearLabel
    }[this.calendar.currentView];
  }

  /** The label for the the next button. */
  get nextButtonLabel(): string {
    return {
      'month': this._intl.nextMonthLabel,
      'year': this._intl.nextYearLabel,
      'multi-year': this._intl.nextMultiYearLabel
    }[this.calendar.currentView];
  }

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.calendar.currentView = this.calendar.currentView === 'month' ? 'multi-year' : 'month';
  }

  /** Handles user clicks on the previous button. */
  previousClicked(): void {
    this.calendar.activeDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
  }

  /** Handles user clicks on the next button. */
  nextClicked(): void {
    this.calendar.activeDate = this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
  }

  /** Whether the previous period button is enabled. */
  previousEnabled(): boolean {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate ||
      !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
  }

  /** Whether the next period button is enabled. */
  nextEnabled(): boolean {
    return !this.calendar.maxDate ||
      !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: D, date2: D): boolean {

    return this._dateAdapter.getYear(date1) === this._dateAdapter.getYear(date2) &&
      this._dateAdapter.getMonth(date1) === this._dateAdapter.getMonth(date2);
  }

}
