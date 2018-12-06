import {
  Directive,
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
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
  Validators
} from '@angular/forms';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { DatepickerEmbeddableComponent } from '../datepicker-embeddable/datepicker-embeddable.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subscription } from 'rxjs';
import { DateFormats, SBB_DATE_FORMATS } from '../date-formats';
import { DateAdapter } from '../date-adapter';
import { createMissingDateImplError } from '../datepicker-errors';
import { TitleCasePipe } from '@angular/common';
import { DateRange } from '../date-range';

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
  exportAs: 'sbbDatepickerInput'
})
export class DatepickerInputDirective<D> implements OnDestroy {

  private titleCasePipe = new TitleCasePipe();

  @HostBinding('attr.aria-haspopup')
  ariaHasPopup = true;

  @HostBinding('attr.aria-owns')
  get ariaOwns() {
    return (this.datepicker && this.datepicker.opened && this.datepicker.id) || null;
  }

  @HostBinding('attr.min')
  get minAttr() {
    return this.min ? this.dateAdapter.toIso8601(this.min) : null;
  }

  @HostBinding('attr.max')
  get maxAttr() {
    return this.max ? this.dateAdapter.toIso8601(this.max) : null;
  }

  @HostBinding('disabled')
  get isDisabled() {
    return this.disabled;
  }


  /** The datepicker that this input is associated with. */
  @Input()
  set sbbDatepicker(value: DatepickerEmbeddableComponent<D>) {
    if (!value) {
      return;
    }

    this.datepicker = value;
    this.datepicker.registerInput(this);
    this.datepickerSubscription.unsubscribe();

    this.datepickerSubscription = this.datepicker.selectedChanged.subscribe((selected: D) => {
      this.value = selected;
      this.cvaOnChange(selected);
      this.onTouched();
      this.dateInput.emit(new SbbDatepickerInputEvent(this, this.elementRef.nativeElement));
      this.dateChange.emit(new SbbDatepickerInputEvent(this, this.elementRef.nativeElement));
    });
  }
  datepicker: DatepickerEmbeddableComponent<D>;

  dateFilter: (date: D | null) => boolean;

  dateRange: DateRange<D>;

  /** The value of the input. */
  @Input()
  get value(): D | null { return this._value; }
  set value(value: D | null) {
    value = this.dateAdapter.deserialize(value);
    this.lastValueValid = !value || this.dateAdapter.isValid(value);
    value = this.getValidDateOrNull(value);
    const oldDate = this.value;
    this._value = value;
    this.formatValue(value);

    if (!this.dateAdapter.sameDate(oldDate, value)) {
      this.valueChange.emit(value);
    }
  }
  private _value: D | null;

  /** The minimum valid date. */
  @Input()
  get min(): D | null { return this._min; }
  set min(value: D | null) {
    this._min = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
    this.validatorOnChange();
  }
  private _min: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null { return this._max; }
  set max(value: D | null) {
    this._max = this.getValidDateOrNull(this.dateAdapter.deserialize(value));
    this.validatorOnChange();
  }
  private _max: D | null;

  /** Whether the datepicker-input is disabled. */
  @Input()
  get disabled(): boolean { return !!this._disabled; }
  set disabled(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    const element = this.elementRef.nativeElement;

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
  private _disabled: boolean;

  /** Emits when a `change` event is fired on this `<input>`. */
  @Output() readonly dateChange: EventEmitter<SbbDatepickerInputEvent<D>> =
    new EventEmitter<SbbDatepickerInputEvent<D>>();

  /** Emits when an `input` event is fired on this `<input>`. */
  @Output() readonly dateInput: EventEmitter<SbbDatepickerInputEvent<D>> =
    new EventEmitter<SbbDatepickerInputEvent<D>>();

  @Output() readonly inputBlurred: EventEmitter<void> = new EventEmitter<void>();

  /** Emits when the value changes (either due to user input or programmatic change). */
  valueChange = new EventEmitter<D | null>();

  /** Emits when the disabled state has changed */
  disabledChange = new EventEmitter<boolean>();

  private datepickerSubscription = Subscription.EMPTY;


  /** Whether the last value set on the input was valid. */
  private lastValueValid = false;

  onTouched = () => { };

  private cvaOnChange: (value: any) => void = () => { };

  public validatorOnChange = () => { };

  /** The form control validator for whether the input parses. */
  private parseValidator: ValidatorFn = (): ValidationErrors | null => {
    return this.lastValueValid ?
      null : { 'sbbtDatepickerParse': { 'text': this.elementRef.nativeElement.value } };
  }

  /** The form control validator for the min date. */
  private minValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this.getValidDateOrNull(this.dateAdapter.deserialize(control.value));
    return (!this.min || !controlValue ||
      this.dateAdapter.compareDate(this.min, controlValue) <= 0) ?
      null : { 'sbbDatepickerMin': { 'min': this.min, 'actual': controlValue } };
  }

  /** The form control validator for the max date. */
  private maxValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this.getValidDateOrNull(this.dateAdapter.deserialize(control.value));
    return (!this.max || !controlValue ||
      this.dateAdapter.compareDate(this.max, controlValue) >= 0) ?
      null : { 'sbbDatepickerMax': { 'max': this.max, 'actual': controlValue } };
  }

  /** The form control validator for the date filter. */
  private filterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const controlValue = this.getValidDateOrNull(this.dateAdapter.deserialize(control.value));
    return !this.dateFilter || !controlValue || this.dateFilter(controlValue) ?
      null : { 'sbbDatepickerFilter': true };
  }


  /** The combined form control validator for this input. */
  // tslint:disable-next-line:member-ordering
  private validator: ValidatorFn | null =
    Validators.compose(
      [this.parseValidator, this.minValidator, this.maxValidator, this.filterValidator]);

  constructor(
    private elementRef: ElementRef<HTMLInputElement>,
    @Optional() public dateAdapter: DateAdapter<D>,
    @Optional() @Inject(SBB_DATE_FORMATS) private dateFormats: DateFormats) {
    if (!this.dateAdapter) {
      throw createMissingDateImplError('DateAdapter');
    }
    if (!this.dateFormats) {
      throw createMissingDateImplError('SBB_DATE_FORMATS');
    }
  }

  ngOnDestroy() {
    this.datepickerSubscription.unsubscribe();
    this.valueChange.complete();
    this.disabledChange.complete();
  }

  /** @docs-private */
  registerOnValidatorChange(fn: () => void): void {
    this.validatorOnChange = fn;
  }

  /** @docs-private */
  validate(c: AbstractControl): ValidationErrors | null {
    return this.validator ? this.validator(c) : null;
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this.elementRef;
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: D): void {
    this.value = value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this.cvaOnChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.datepicker && event.altKey && event.keyCode === DOWN_ARROW) {
      this.datepicker.open();
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    let date = this.dateAdapter.parse(value);
    this.lastValueValid = !date || this.dateAdapter.isValid(date);
    date = this.getValidDateOrNull(date);

    if (!this.dateAdapter.sameDate(date, this._value)) {
      this._value = date;
      this.cvaOnChange(date);
      this.valueChange.emit(date);
      this.dateInput.emit(new SbbDatepickerInputEvent(this, this.elementRef.nativeElement));
    }
  }

  @HostListener('change')
  onChange() {
    this.dateChange.emit(new SbbDatepickerInputEvent(this, this.elementRef.nativeElement));
  }

  /** Handles blur events on the input. */
  @HostListener('blur')
  onBlur() {
    // Reformat the input only if we have a valid value.
    if (this.value) {
      this.formatValue(this.value);
    }

    this.onTouched();
    this.inputBlurred.emit();
  }

  /** Formats a value and sets it on the input element. */
  private formatValue(value: D | null) {
    this.elementRef.nativeElement.value =
      value ? this.titleCasePipe.transform(this.dateAdapter.format(value, this.dateFormats.dateInput))
        : '';
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private getValidDateOrNull(obj: any): D | null {
    return (this.dateAdapter.isDateInstance(obj) && this.dateAdapter.isValid(obj)) ? obj : null;
  }
}
