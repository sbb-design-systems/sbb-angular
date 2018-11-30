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
  LOCALE_ID,
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
export type CalendarView = 'month';


@Component({
  selector: 'sbb-calendar-header',
  templateUrl: './calendar-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeaderComponent<D> {
  constructor(private intl: DatepickerIntlService,
    // tslint:disable-next-line:no-use-before-declare
    @Inject(forwardRef(() => CalendarComponent)) public calendar: CalendarComponent<D>,
    @Optional() private dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: DateFormats,
    changeDetectorRef: ChangeDetectorRef) {

    this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
  }


  /** The label for the current calendar view. */
  get monthText(): string {
    return this.dateAdapter.getMonthName(this.calendar.activeDate);

  }

  /** The label for the current calendar view. */
  get yearText(): string {
    return this.dateAdapter.getYearName(this.calendar.activeDate);
  }

  /** The label for the the previous button. */
  get prevButtonLabel(): string {
    return {
      'month': this.intl.prevMonthLabel,
      'year': this.intl.prevYearLabel,
      'multi-year': this.intl.prevMultiYearLabel
    }[this.calendar.currentView];
  }

  /** The label for the the next button. */
  get nextButtonLabel(): string {
    return {
      'month': this.intl.nextMonthLabel,
      'year': this.intl.nextYearLabel,
      'multi-year': this.intl.nextMultiYearLabel
    }[this.calendar.currentView];
  }

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.calendar.currentView = 'month';
  }

  /** Handles user clicks on the previous button. */
  previousMonthClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, -1);
  }

  /** Handles user clicks on the next button. */
  nextMonthClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarMonths(this.calendar.activeDate, 1);
  }

  /** Whether the previous period button is enabled. */
  previousMonthEnabled(): boolean {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate ||
      !this._isSameMonthView(this.calendar.activeDate, this.calendar.minDate);
  }

  /** Whether the next period button is enabled. */
  nextMonthEnabled(): boolean {
    return !this.calendar.maxDate ||
      !this._isSameMonthView(this.calendar.activeDate, this.calendar.maxDate);
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameMonthView(date1: D, date2: D): boolean {

    return this.dateAdapter.getMonth(date1) === this.dateAdapter.getMonth(date2);
  }

  /** Handles user clicks on the previous button. */
  previousYearClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarYears(this.calendar.activeDate, -1);
  }

  /** Handles user clicks on the next button. */
  nextYearClicked(): void {
    this.calendar.activeDate = this.dateAdapter.addCalendarYears(this.calendar.activeDate, 1);
  }

  /** Whether the previous period button is enabled. */
  previousYearEnabled(): boolean {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate ||
      !this._isSameMonthView(this.calendar.activeDate, this.calendar.minDate);
  }

  /** Whether the next period button is enabled. */
  nextYearEnabled(): boolean {
    return !this.calendar.maxDate ||
      !this._isSameMonthView(this.calendar.activeDate, this.calendar.maxDate);
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent<D> implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges {


  @HostBinding('class')
  cssClass = 'sbb-calendar';

  /** An input indicating the type of the header component, if set. */
  @Input() headerComponent: ComponentType<any>;

  /** A portal containing the header component type for this calendar. */
  calendarHeaderPortal: Portal<any>;

  private intlChanges: Subscription;

  /**
   * Used for scheduling that focus should be moved to the active cell on the next tick.
   * We need to schedule it, rather than do it immediately, because we have to wait
   * for Angular to re-evaluate the view children.
   */
  private moveFocusOnNextTick = false;

  /** A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt(): D | null { return this._startAt; }
  set startAt(value: D | null) {
    this._startAt = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
  }
  private _startAt: D | null;

  /** Whether the calendar should be started in month or year view. */
  @Input() startView: CalendarView = 'month';

  /** The currently selected date. */
  @Input()
  get selected(): D | null { return this._selected; }
  set selected(value: D | null) {
    this._selected = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
  }
  private _selected: D | null;

  /** The minimum selectable date. */
  @Input()
  get minDate(): D | null { return this._minDate; }
  set minDate(value: D | null) {
    this._minDate = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
  }
  private _minDate: D | null;

  /** The maximum selectable date. */
  @Input()
  get maxDate(): D | null { return this._maxDate; }
  set maxDate(value: D | null) {
    this._maxDate = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
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
  @Output() readonly userSelection: EventEmitter<void> = new EventEmitter<void>();

  /** Reference to the current month view component. */
  @ViewChild(MonthViewComponent) monthView: MonthViewComponent<D>;

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get activeDate(): D { return this.clampedActiveDate; }
  set activeDate(value: D) {
    this.clampedActiveDate = this.dateAdapter.clampDate(value, this.minDate, this.maxDate);
    this.stateChanges.next();
  }
  private clampedActiveDate: D;

  /** Whether the calendar is in month view. */
  get currentView(): CalendarView { return this._currentView; }
  set currentView(value: CalendarView) {
    this._currentView = value;
    this.moveFocusOnNextTick = true;
  }
  private _currentView: CalendarView;

  /**
   * Emits whenever there is a state change that the header may need to respond to.
   */
  stateChanges = new Subject<void>();

  constructor(intl: DatepickerIntlService,
    @Optional() private dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private dateFormats: DateFormats,
    private changeDetectorRef: ChangeDetectorRef) {

    if (!this.dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }

    if (!this.dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }

    this.intlChanges = intl.changes.subscribe(() => {
      changeDetectorRef.markForCheck();
      this.stateChanges.next();
    });
  }

  ngAfterContentInit() {
    this.calendarHeaderPortal = new ComponentPortal(this.headerComponent || CalendarHeaderComponent);
    this.activeDate = this.startAt || this.dateAdapter.today();

    // Assign to the private property since we don't want to move focus on init.
    this._currentView = this.startView;
  }

  ngAfterViewChecked() {
    if (this.moveFocusOnNextTick) {
      this.moveFocusOnNextTick = false;
      this.focusActiveCell();
    }
  }

  ngOnDestroy() {
    this.intlChanges.unsubscribe();
    this.stateChanges.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes.minDate || changes.maxDate || changes.dateFilter;

    if (change && !change.firstChange) {
      const view = this.getCurrentViewComponent();

      if (view) {
        // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
        // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
        this.changeDetectorRef.detectChanges();
        view.init();
      }
    }

    this.stateChanges.next();
  }

  focusActiveCell() {
    this.getCurrentViewComponent().focusActiveCell();
  }

  /** Handles date selection in the month view. */
  dateSelected(date: D): void {
    if (!this.dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }
  }

  userSelected(): void {
    this.userSelection.emit();
  }

  /** Handles year/month selection in the multi-year/year views. */
  goToDateInView(date: D, view: 'month'): void {
    this.activeDate = date;
    this.currentView = view;
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private getValidDateOrNull(obj: any): D | null {
    return (this.dateAdapter.isDateInstance(obj) && this.dateAdapter.isValid(obj)) ? obj : null;
  }

  /** Returns the component instance that corresponds to the current calendar view. */
  private getCurrentViewComponent() {
    return this.monthView;
  }
}

