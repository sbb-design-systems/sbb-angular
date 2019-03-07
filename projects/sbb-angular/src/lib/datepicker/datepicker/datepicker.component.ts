import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ViewChild,
  Input,
  forwardRef,
  Optional,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  HostBinding,
  Inject,
  AfterViewInit
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
import { FORM_FIELD, FormFieldControl } from '../../field/field';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { InputDirective } from '../../input/input';
import { HasFormFieldControl } from '../../field/has-form-field-control';


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

export function formFieldControlForwarder(datepicker: DatepickerComponent) {
  return datepicker.nativeInput;
}

export const SBB_DATEPICKER_FORM_FIELD_CONTROL: any = {
  provide: FormFieldControl,
  useFactory: formFieldControlForwarder,
  deps: [forwardRef(() => DatepickerComponent)]
};

@Component({
  selector: 'sbb-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    SBB_DATEPICKER_VALUE_ACCESSOR,
    SBB_DATEPICKER_VALIDATORS,
    SBB_DATEPICKER_FORM_FIELD_CONTROL,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements ControlValueAccessor, Validator, AfterViewInit {

  /** The value of the datepicker. */
  @Input()
  get value(): Date | null {
    return this.datepickerInput ? this.datepickerInput.value : this._value;
  }
  set value(value: Date | null) {
    this._value = value;
    this.changeDetectorRef.markForCheck();
  }
  private _value;

  /** @docs-private */
  get forwardValue() { return this._value; }

  /** The minimum valid date. */
  @Input()
  min: Date | null;

  /** The maximum valid date. */
  @Input()
  max: Date | null;

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    this.changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  /**
   * Property active when a toDatepicker is defined
   */
  dateRange: DateRange<Date>;

  /**
  * Embedded datepicker with calendar header and body, switches for next/prev months and years
  */
  @ViewChild('picker') embeddedDatepicker: DatepickerEmbeddableComponent<Date>;
  @ViewChild(DatepickerToggleComponent) datepickerToggle: DatepickerToggleComponent<Date>;
  @ViewChild(InputDirective) nativeInput: InputDirective;

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
    this.executeOrStoreAction(() => {
      this.datepickerInput.dateRange = this.dateRange;
      this.attachedDatepicker.datepickerInput.dateRange = this.dateRange;
    });
  }
  attachedDatepicker: DatepickerComponent;

  @HostBinding('class.sbb-datepicker') cssClass = true;

  /**
   * Embedded input field connected to the datepicker
   */
  @ViewChild(DatepickerInputDirective) datepickerInput: DatepickerInputDirective<Date>;

  /** Emits when the datepicker has been opened. */
  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the datepicker has been closed. */
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();


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
    return this._withArrows;
  }
  set withArrows(withArrows: any) {
    this._withArrows = coerceBooleanProperty(withArrows);
    this.changeDetectorRef.markForCheck();
  }
  private _withArrows = false;

  @Input()
  @HostBinding('class.sbb-datepicker-without-toggle')
  get withoutToggle() {
    return this._withoutToggle;
  }
  set withoutToggle(withoutToggle: any) {
    this._withoutToggle = coerceBooleanProperty(withoutToggle);
  }
  private _withoutToggle = false;

  get leftArrow(): boolean {
    return this.isDayScrollApplicable()
      && (!this.min || this.dateAdapter.compareDate(this.embeddedDatepicker.selected, this.min) > 0);
  }
  get rightArrow(): boolean {
    return this.isDayScrollApplicable()
      && (!this.max || this.dateAdapter.compareDate(this.embeddedDatepicker.selected, this.max) < 0);
  }

  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  set validDateFilter(fn: (date: Date | null) => boolean) {
    this.executeOrStoreAction(() => {
      this.datepickerInput.dateFilter = fn;
      this.datepickerInput.validatorOnChange();
    });
  }

  get isInFormField() {
    return !!this.formField;
  }

  private afterViewInitActions: Array<() => void> = [];

  constructor(
    public dateAdapter: DateAdapter<Date>,
    @Inject(FORM_FIELD) @Optional() private formField: HasFormFieldControl,
    private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.afterViewInitActions.forEach(a => a());
    this.afterViewInitActions = [];

    this.datepickerInput.valueChange.subscribe(newDateValue => {
      this.embeddedDatepicker.selected = newDateValue;
      this.changeDetectorRef.markForCheck();
    });

    this.embeddedDatepicker.closedStream.subscribe(() => {
      this.closed.emit();
      this.handleRangeDatepicker(this.datepickerInput.value);
    });

    this.embeddedDatepicker.openedStream.subscribe(() => this.opened.emit());
    this.datepickerInput.dateChange
      .subscribe((datepickerInputEvent: SbbDatepickerInputEvent<Date>) => this.dateChange.emit(datepickerInputEvent));
    this.datepickerInput.dateInput
      .subscribe((datepickerInputEvent: SbbDatepickerInputEvent<Date>) => this.dateInput.emit(datepickerInputEvent));
    this.datepickerInput.inputBlurred.subscribe(() => this.handleRangeDatepicker(this.datepickerInput.value));

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

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.executeOrStoreAction(() => this.datepickerInput.registerOnChange(fn));
  }
  registerOnTouched(fn: any): void {
    this.executeOrStoreAction(() => this.datepickerInput.registerOnTouched(fn));
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.executeOrStoreAction(() => this.datepickerInput.registerOnValidatorChange(fn));
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.datepickerInput ? this.datepickerInput.validate(c) : null;
  }

  private isDayScrollApplicable(): boolean {
    return this.withArrows && !!this.value;
  }

  private scrollToDay(value: 'prev' | 'next') {
    value === 'prev' ? this.embeddedDatepicker.prevDay() : this.embeddedDatepicker.nextDay();
    this.changeDetectorRef.markForCheck();
    this.handleRangeDatepicker(this.datepickerInput.value, true);
  }

  /**
  * Manages the 2nd datepicker linked to this instance.
  * If the 2nd datepicker has no value, its calendar will open up when filling this datepicker value.
  */
  private handleRangeDatepicker(beginDate: Date, arrowClick: boolean = false) {
    if (this.attachedDatepicker && beginDate && this.dateAdapter.isValid(beginDate)) {
      this.dateRange.begin = beginDate;
      if (!this.attachedDatepicker.datepickerInput.value && !arrowClick) {
        this.attachedDatepicker.embeddedDatepicker.open();
      } else if (this.dateAdapter.compareDate(beginDate, this.attachedDatepicker.datepickerInput.value) > 0) {
        this.attachedDatepicker.datepickerInput.value = null;
        if (!arrowClick) {
          this.attachedDatepicker.embeddedDatepicker.open();
        }
      } else {
        this.dateRange.end = this.attachedDatepicker.datepickerInput.value;
      }
      this.attachedDatepicker.min = beginDate;
    }
  }

  private executeOrStoreAction(action: () => void) {
    if (this.datepickerInput) {
      action();
    } else {
      this.afterViewInitActions.push(action);
    }
  }
}
