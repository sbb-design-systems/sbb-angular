import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SbbDateAdapter, SbbDateFormats, SBB_DATE_FORMATS, TypeRef } from '@sbb-esta/angular/core';
import { SbbFormField, SBB_FORM_FIELD } from '@sbb-esta/angular/form-field';
import { SBB_INPUT_VALUE_ACCESSOR } from '@sbb-esta/angular/input';
import { Subscription } from 'rxjs';

import { createMissingDateImplError } from '../datepicker-errors';
import { SbbDatepicker } from '../datepicker/datepicker';

/**
 * An event used for date input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use SbbDateInputEvent instead.
 */
export class SbbDateInputEvent<D> {
  /** The new value for the target date input. */
  value: D | null;

  constructor(
    /** Reference to the date input component that emitted the event. */
    public target: SbbDateInput<D>,
    /** Reference to the native input element associated with the date input. */
    public targetElement: HTMLElement,
  ) {
    this.value = this.target.value;
  }
}

export const SBB_DATE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SbbDateInput),
  multi: true,
};

export const SBB_DATE_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SbbDateInput),
  multi: true,
};

@Directive({
  selector: 'input[sbbDateInput]',
  exportAs: 'sbbDateInput',
  providers: [
    SBB_DATE_VALUE_ACCESSOR,
    SBB_DATE_VALIDATORS,
    { provide: SBB_INPUT_VALUE_ACCESSOR, useExisting: SbbDateInput },
  ],
  host: {
    class: 'sbb-date-input',
    '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
    '[attr.aria-owns]': '(this._datepicker?.opened && this._datepicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    '[disabled]': 'this.disabled',
  },
  standalone: true,
})
export class SbbDateInput<D> implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  set dateFilter(value: (date: D | null) => boolean) {
    this._dateFilter = value;
    this._validatorOnChange();
  }
  get dateFilter() {
    return this._dateFilter;
  }
  private _dateFilter: (date: D | null) => boolean;

  /** The value of the input. */
  @Input()
  get value(): D | null {
    return this._value;
  }
  set value(value: D | null) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this._formatValue(value);

    if (!this._dateAdapter.sameDate(oldDate, value)) {
      this.valueChange.emit(value);
    }
  }
  private _value: D | null;

  /** The minimum valid date. */
  @Input()
  get min(): D | null {
    return (
      this._min ||
      (this._datepicker &&
      this._datepicker.main &&
      this._datepicker.main.datepickerInput &&
      this._datepicker.main.datepickerInput.value
        ? this._datepicker.main.datepickerInput.value
        : null)
    );
  }
  set min(value: D | null) {
    this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _min: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null {
    return this._max;
  }
  set max(value: D | null) {
    this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _max: D | null;

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this.disabledChange.emit(newValue);
    }

    // We need to null check the `blur` method, because it's undefined during SSR.
    if (newValue && element.blur) {
      // Normally, native input elements automatically blur if they turn disabled. This behavior
      // is problematic, because it would mean that it triggers another change detection cycle,
      // which then causes a changed after checked error if the input element was focused before.
      element.blur();
    }
  }
  private _disabled = false;

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
    this.readonlyChange.next(this._readonly);
  }
  private _readonly = false;

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly dateChange: EventEmitter<SbbDateInputEvent<D>> = new EventEmitter<
    SbbDateInputEvent<D>
  >();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly dateInput: EventEmitter<SbbDateInputEvent<D>> = new EventEmitter<
    SbbDateInputEvent<D>
  >();

  /** Emits when the input gets blurred. */
  @Output() readonly inputBlurred: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  valueChange: EventEmitter<D | null> = new EventEmitter<D | null>();

  /** Emits when the disabled state has changed */
  disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Emits when the readonly state has changed */
  readonlyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _datepickerSubscription = Subscription.EMPTY;

  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  /** `View -> model callback called when date input has been touched` */
  _onTouched: () => void = () => {};

  /** `View -> model callback called when value changes` */
  _cvaOnChange: (value: any) => void = () => {};

  private _validatorOnChange = () => {};

  /** The form control validator for whether the input parses. */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid
      ? null
      : { sbbDateParse: { text: this._elementRef.nativeElement.value } };
  };

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this.min || !controlValue || this._dateAdapter.compareDate(this.min, controlValue) <= 0
      ? null
      : { sbbDateMin: { min: this.min, actual: controlValue } };
  };

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this.max || !controlValue || this._dateAdapter.compareDate(this.max, controlValue) >= 0
      ? null
      : { sbbDateMax: { max: this.max, actual: controlValue } };
  };

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !controlValue || this._dateFilter(controlValue)
      ? null
      : { sbbDateFilter: true };
  };

  /** The combined form control validator for this input. */
  // tslint:disable-next-line:member-ordering
  private _validator: ValidatorFn | null = Validators.compose([
    this._parseValidator,
    this._minValidator,
    this._maxValidator,
    this._filterValidator,
  ]);

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    @Optional() public _dateAdapter: SbbDateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: SbbDateFormats,
    @Optional() public _datepicker: SbbDatepicker<D>,
    @Optional() @Inject(SBB_FORM_FIELD) private _formField?: SbbFormField,
  ) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }
  }

  ngOnInit(): void {
    if (!this._datepicker) {
      return;
    }

    this._datepicker.registerInput(this);
    this._datepickerSubscription.unsubscribe();

    this._datepickerSubscription = this._datepicker.selectedChanged.subscribe((selected: D) => {
      this.value = selected;
      this._cvaOnChange(selected);
      this._onTouched();
      this.dateInput.emit(new SbbDateInputEvent(this, this._elementRef.nativeElement));
      this.dateChange.emit(new SbbDateInputEvent(this, this._elementRef.nativeElement));
    });
  }

  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this.valueChange.complete();
    this.disabledChange.complete();
  }

  /** @docs-private */
  registerOnValidatorChange(fn: () => void): void {
    this._validatorOnChange = fn;
  }

  /** @docs-private */
  validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._elementRef;
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('keydown', ['$event'])
  _onKeydown(event: TypeRef<KeyboardEvent>) {
    if (this._datepicker && event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value'])
  _onInput(value: string) {
    let date = this._dateAdapter.parse(value);
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._getValidDateOrNull(date);

    if (!this._dateAdapter.sameDate(date, this._value)) {
      this._value = date;
      this._cvaOnChange(date);
      this.valueChange.emit(date);
      this.dateInput.emit(new SbbDateInputEvent(this, this._elementRef.nativeElement));
    } else {
      this._validatorOnChange();
    }
  }

  @HostListener('change')
  _onChange() {
    this.dateChange.emit(new SbbDateInputEvent(this, this._elementRef.nativeElement));
  }

  /** Handles blur events on the input. */
  @HostListener('blur')
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
    this.inputBlurred.emit();
  }

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: D | null) {
    const displayFormat = this._datepicker
      ? this._dateFormats.dateInput
      : this._dateFormats.dateInputPure ?? this._dateFormats.dateInput;
    this._elementRef.nativeElement.value =
      value != null ? this._dateAdapter.format(value, displayFormat) : '';
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj) ? obj : null;
  }

  /** Gets the ID of an element that should be used a description for the calendar overlay. */
  getOverlayLabelId(): string | null {
    if (this._formField) {
      return this._formField.getLabelId();
    }

    return this._elementRef.nativeElement.getAttribute('aria-labelledby');
  }
}
