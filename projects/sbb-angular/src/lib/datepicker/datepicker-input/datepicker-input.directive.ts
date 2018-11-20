import {
  Directive,
  forwardRef,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  Optional,
  ElementRef,
  Inject,
  HostBinding,
  HostListener
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  Validator,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  Validators,
  NG_VALIDATORS
} from '@angular/forms';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';
import { SbbFieldComponent } from '../../field';
import { DateFormats, SBB_DATE_FORMATS } from '../date-formats';
import { DateAdapter } from '../date-adapter';
import { createMissingDateImplError } from '../datepicker-errors';


export const SBB_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatepickerInputDirective),
  multi: true
};

export const SBB_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DatepickerInputDirective),
  multi: true
};

/**
 * An event used for datepicker input and change events. We don't always have access to a native
 * input or change event because the event may have been triggered by the user clicking on the
 * calendar popup. For consistency, we always use SbbDatepickerInputEvent instead.
 */
export class SbbDatepickerInputEvent<D> {
  /** The new value for the target datepicker input. */
  value: D | null;

  constructor(
    /** Reference to the datepicker input component that emitted the event. */
    public target: DatepickerInputDirective<D>,
    /** Reference to the native input element associated with the datepicker input. */
    public targetElement: HTMLElement) {
    this.value = this.target.value;
  }
}

@Directive({
  selector: 'input[sbbDatepicker]',
  providers: [
    SBB_DATEPICKER_VALUE_ACCESSOR,
    SBB_DATEPICKER_VALIDATORS

  ],
  exportAs: 'sbbDatepickerInput'
})
export class DatepickerInputDirective<D> implements ControlValueAccessor, OnDestroy, Validator {


  @HostBinding('attr.aria-haspopup')
  ariaHasPopup = true;

  @HostBinding('attr.aria-owns')
  get ariaOwns() {
    return (this._datepicker && this._datepicker.opened && this._datepicker.id) || null;
  }

  @HostBinding('attr.min')
  get minAttr() {
    return this.min ? this._dateAdapter.toIso8601(this.min) : null;
  }

  @HostBinding('attr.max')
  get maxAttr() {
    return this.max ? this._dateAdapter.toIso8601(this.max) : null;
  }

  @HostBinding('disabled')
  get isDisabled() {
    return this.disabled;
  }


  /** The datepicker that this input is associated with. */
  @Input()
  set sbbDatepicker(value: DatepickerComponent<D>) {
    if (!value) {
      return;
    }

    this._datepicker = value;
    this._datepicker._registerInput(this);
    this._datepickerSubscription.unsubscribe();

    this._datepickerSubscription = this._datepicker._selectedChanged.subscribe((selected: D) => {
      this.value = selected;
      this._cvaOnChange(selected);
      this._onTouched();
      this.dateInput.emit(new SbbDatepickerInputEvent(this, this._elementRef.nativeElement));
      this.dateChange.emit(new SbbDatepickerInputEvent(this, this._elementRef.nativeElement));
    });
  }
  _datepicker: DatepickerComponent<D>;

  /** Function that can be used to filter out dates within the datepicker. */
  @Input()
  set sbbDatepickerFilter(value: (date: D | null) => boolean) {
    this._dateFilter = value;
    this._validatorOnChange();
  }
  _dateFilter: (date: D | null) => boolean;

  /** The value of the input. */
  @Input()
  get value(): D | null { return this._value; }
  set value(value: D | null) {
    value = this._dateAdapter.deserialize(value);
    this._lastValueValid = !value || this._dateAdapter.isValid(value);
    value = this._getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this._formatValue(value);

    if (!this._dateAdapter.sameDate(oldDate, value)) {
      this._valueChange.emit(value);
    }
  }
  private _value: D | null;

  /** The minimum valid date. */
  @Input()
  get min(): D | null { return this._min; }
  set min(value: D | null) {
    this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _min: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null { return this._max; }
  set max(value: D | null) {
    this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._validatorOnChange();
  }
  private _max: D | null;

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled(): boolean { return !!this._disabled; }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const element = this._elementRef.nativeElement;

    if (this._disabled !== newValue) {
      this._disabled = newValue;
      this._disabledChange.emit(newValue);
    }

    // We need to null check the `blur` method, because it's undefined during SSR.
    if (newValue && element.blur) {
      // Normally, native input elements automatically blur if they turn disabled. This behavior
      // is problematic, because it would mean that it triggers another change detection cycle,
      // which then causes a changed after checked error if the input element was focused before.
      element.blur();
    }
  }
  private _disabled: boolean;

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly dateChange: EventEmitter<SbbDatepickerInputEvent<D>> =
    new EventEmitter<SbbDatepickerInputEvent<D>>();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly dateInput: EventEmitter<SbbDatepickerInputEvent<D>> =
    new EventEmitter<SbbDatepickerInputEvent<D>>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  _valueChange = new EventEmitter<D | null>();

  /** Emits when the disabled state has changed */
  _disabledChange = new EventEmitter<boolean>();

  private _datepickerSubscription = Subscription.EMPTY;

  private _localeSubscription = Subscription.EMPTY;


  /** Whether the last value set on the input was valid. */
  private _lastValueValid = false;

  _onTouched = () => { };

  private _cvaOnChange: (value: any) => void = () => { };

  private _validatorOnChange = () => { };

  /** The form control validator for whether the input parses. */
  private _parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this._lastValueValid ?
      null : { 'sbbtDatepickerParse': { 'text': this._elementRef.nativeElement.value } };
  }

  /** The form control validator for the min date. */
  private _minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.min || !controlValue ||
      this._dateAdapter.compareDate(this.min, controlValue) <= 0) ?
      null : { 'sbbDatepickerMin': { 'min': this.min, 'actual': controlValue } };
  }

  /** The form control validator for the max date. */
  private _maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return (!this.max || !controlValue ||
      this._dateAdapter.compareDate(this.max, controlValue) >= 0) ?
      null : { 'sbbDatepickerMax': { 'max': this.max, 'actual': controlValue } };
  }

  /** The form control validator for the date filter. */
  private _filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this._getValidDateOrNull(this._dateAdapter.deserialize(control.value));
    return !this._dateFilter || !controlValue || this._dateFilter(controlValue) ?
      null : { 'sbbDatepickerFilter': true };
  }


  /** The combined form control validator for this input. */
  // tslint:disable-next-line:member-ordering
  private _validator: ValidatorFn | null =
    Validators.compose(
      [this._parseValidator, this._minValidator, this._maxValidator, this._filterValidator]);

  constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    @Optional() public _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private _dateFormats: DateFormats,
    @Optional() private _formField: SbbFieldComponent) {
    if (!this._dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this._dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }

    // Update the displayed date when the locale changes.
    this._localeSubscription = _dateAdapter.localeChanges.subscribe(() => {
      this.value = this.value;
    });
  }

  ngOnDestroy() {
    this._datepickerSubscription.unsubscribe();
    this._localeSubscription.unsubscribe();
    this._valueChange.complete();
    this._disabledChange.complete();
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
   * @deprecated
   * @breaking-change 7.0.0 Use `getConnectedOverlayOrigin` instead
   */
  getPopupConnectionElementRef(): ElementRef {
    return this.getConnectedOverlayOrigin();
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
  _onKeydown(event: KeyboardEvent) {
    if (this._datepicker && event.altKey && event.keyCode === DOWN_ARROW) {
      this._datepicker.open();
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value'])
  _onInput(value: string) {
    let date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
    this._lastValueValid = !date || this._dateAdapter.isValid(date);
    date = this._getValidDateOrNull(date);

    if (!this._dateAdapter.sameDate(date, this._value)) {
      this._value = date;
      this._cvaOnChange(date);
      this._valueChange.emit(date);
      this.dateInput.emit(new SbbDatepickerInputEvent(this, this._elementRef.nativeElement));
    }
  }

  @HostListener('change')
  _onChange() {
    this.dateChange.emit(new SbbDatepickerInputEvent(this, this._elementRef.nativeElement));
  }

  /** Handles blur events on the input. */
  @HostListener('blur')
  _onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this._formatValue(this.value);
    }

    this._onTouched();
  }

  /** Formats a value and sets it on the input element. */
  private _formatValue(value: D | null) {
    this._elementRef.nativeElement.value =
      value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: any): D | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
  }
}
