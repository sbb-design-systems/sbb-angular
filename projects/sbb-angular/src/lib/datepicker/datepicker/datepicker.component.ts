import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  Input,
  forwardRef,
  Optional,
  ChangeDetectorRef,
  OnInit,
  Output,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';
import { DatepickerEmbeddableComponent } from '../datepicker-embeddable/datepicker-embeddable.component';
import {
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';
import { DatepickerInputDirective, SbbDatepickerInputEvent } from '../datepicker-input/datepicker-input.directive';
import { DateAdapter } from '../date-adapter';
import { DateRange } from '../date-range';
import { DatepickerToggleComponent } from '../datepicker-toggle/datepicker-toggle.component';


export const SBB_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

export const SBB_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  // tslint:disable-next-line:no-use-before-declare
  useExisting: forwardRef(() => DatepickerComponent),
  multi: true
};

@Component({
  selector: 'sbb-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    SBB_DATEPICKER_VALUE_ACCESSOR,
    SBB_DATEPICKER_VALIDATORS
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements ControlValueAccessor, Validator, OnInit {


  /** The minimum valid date. */
  @Input()
  set min(value: Date) {
    this.datepickerInput.min = value;
  }
  get min() {
    return this.datepickerInput.min;
  }

  /** The maximum valid date. */
  @Input()
  set max(value: Date) {
    this.datepickerInput.max = value;
  }
  get max() {
    return this.datepickerInput.max;
  }

  /** Whether the datepicker-input is disabled. */
  @Input()
  disabled: boolean;

  /**
   * Property active when a toDatepicker is defined
   */
  dateRange: DateRange<Date>;

  /**
  * Embedded datepicker with calendar header and body, switches for next/prev months and years
  */
  @ViewChild('picker') embeddedDatepicker: DatepickerEmbeddableComponent<Date>;
  @ViewChild(DatepickerToggleComponent) datepickerToggle: DatepickerToggleComponent<Date>;

  /**
   * Second datepicker to be used in 2 datepickers use case
   */
  @Input()
  set attachDatepicker(value: DatepickerComponent) {
    if (!value) {
      return;
    }
    this.attachedDatepicker = value;
    this.dateRange = new DateRange();
    this.datepickerInput.dateRange = this.dateRange;
    this.attachedDatepicker.datepickerInput.dateRange = this.dateRange;

  }
  attachedDatepicker: DatepickerComponent;

  @HostBinding('class')
  cssClass = 'sbb-datepicker';

  /**
   * Embedded input field connected to the datepicker
   */
  @ViewChild(DatepickerInputDirective) datepickerInput: DatepickerInputDirective<Date>;

  /** Emits when the datepicker has been opened. */
  @Output('opened') opened: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output('closed') closed: EventEmitter<void> = new EventEmitter<void>();


  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly dateChange: EventEmitter<SbbDatepickerInputEvent<Date>> =
    new EventEmitter<SbbDatepickerInputEvent<Date>>();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly dateInput: EventEmitter<SbbDatepickerInputEvent<Date>> =
    new EventEmitter<SbbDatepickerInputEvent<Date>>();

  /**
   * Scrolls used to go directly to the next/prev day. They also support min and max date limits.
   */
  @Input()
  @HostBinding('class.sbb-datepicker-with-arrows')
  get withArrows() {
    return this.isWithArrows;
  }
  set withArrows(withArrows: any) {
    this.isWithArrows = withArrows === '' ? true : Boolean(withArrows);
    this.checkArrows();
    this.embeddedDatepicker.withArrows = this.isWithArrows;
  }
  private isWithArrows = false;

  @Input()
  @HostBinding('class.sbb-datepicker-without-toggle')
  get withoutToggle() {
    return this.isWithoutToggle;
  }
  set withoutToggle(withoutToggle: any) {
    this.isWithoutToggle = withoutToggle === '' ? true : Boolean(withoutToggle);
  }
  private isWithoutToggle = false;

  leftArrow: boolean;
  rightArrow: boolean;

  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  set validDateFilter(fn: (date: Date | null) => boolean) {
    this.datepickerInput.dateFilter = fn;
    this.datepickerInput.validatorOnChange();
  }

  private isDayScrollApplicable(): boolean {
    return this.withArrows && !!this.datepickerInput.value;
  }


  constructor(
    @Optional() public dateAdapter: DateAdapter<Date>,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  private checkArrows() {
    this.rightArrow = false;
    this.leftArrow = false;
    if (this.isDayScrollApplicable()) {
      if (this.min) {
        this.leftArrow = this.dateAdapter.compareDate(this.embeddedDatepicker.selected, this.min) > 0;
      } else {
        this.leftArrow = true;

      }
      if (this.max) {
        this.rightArrow = this.dateAdapter.compareDate(this.embeddedDatepicker.selected, this.max) < 0;
      } else {
        this.rightArrow = true;
      }
    }
  }

  /**
  * Manages the 2nd datepicker linked to this instance.
  * If the 2nd datepicker has no value, its calendar will open up when filling this datepicker value.
  */
  private handleRangeDatepicker(beginDate: Date, arrowClick: boolean = false) {
    if (this.attachedDatepicker) {
      if (beginDate && this.dateAdapter.isValid(beginDate)) {
        this.dateRange.begin = beginDate;
        if (!this.attachedDatepicker.datepickerInput.value && !arrowClick) {
          this.attachedDatepicker.embeddedDatepicker.open();
        } else {
          if (this.dateAdapter.compareDate(beginDate, this.attachedDatepicker.datepickerInput.value) > 0) {
            this.attachedDatepicker.datepickerInput.value = null;
            if (!arrowClick) {
              this.attachedDatepicker.embeddedDatepicker.open();
            }
          } else {
            this.dateRange.end = this.attachedDatepicker.datepickerInput.value;
          }
        }
        this.attachedDatepicker.min = beginDate;
      }
    }
  }

  ngOnInit(): void {
    this.datepickerInput.valueChange.subscribe(newDateValue => {
      this.embeddedDatepicker.selected = newDateValue;
      if (this.withArrows) {
        this.checkArrows();
      }
      this.changeDetectorRef.markForCheck();

    });

    this.embeddedDatepicker.closedStream.subscribe(() => {
      this.closed.emit();
      this.handleRangeDatepicker(this.datepickerInput.value);
    });

    this.embeddedDatepicker.openedStream.subscribe(() => {
      this.opened.emit();
    });

    this.datepickerInput.dateChange.subscribe((datepickerInputEvent: SbbDatepickerInputEvent<Date>) => {
      this.dateChange.emit(datepickerInputEvent);
    });

    this.datepickerInput.dateInput.subscribe((datepickerInputEvent: SbbDatepickerInputEvent<Date>) => {
      this.dateInput.emit(datepickerInputEvent);
    });

    this.datepickerInput.inputBlurred.subscribe(() => {
      this.handleRangeDatepicker(this.datepickerInput.value);
    });

    if (this.attachedDatepicker) {
      this.attachedDatepicker.datepickerInput.valueChange.subscribe(newEndDateValue => {
        this.dateRange.end = newEndDateValue;
      });
    }
  }

  /**
  * Adds or removes a day when clicking on the arrow buttons on the left of the input
  */
  scrollToPreviousDay() {
    this.scrollToDay('prev');
  }

  /**
  * Adds or removes a day when clicking on the arrow buttons on the right/left of the input
  */
  scrollToNextDay() {
    this.scrollToDay('next');
  }

  private scrollToDay(value: 'prev' | 'next') {
    value === 'prev' ? this.embeddedDatepicker.prevDay() : this.embeddedDatepicker.nextDay();
    this.checkArrows();
    this.handleRangeDatepicker(this.datepickerInput.value, true);
  }

  writeValue(obj: any): void {
    this.datepickerInput.writeValue(obj);
  }
  registerOnChange(fn: any): void {
    this.datepickerInput.registerOnChange(fn);
  }
  registerOnTouched(fn: any): void {
    this.datepickerInput.registerOnTouched(fn);
  }
  setDisabledState(isDisabled: boolean): void {
    this.datepickerInput.setDisabledState(isDisabled);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.datepickerInput.registerOnValidatorChange(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.datepickerInput.validate(c);
  }

}
