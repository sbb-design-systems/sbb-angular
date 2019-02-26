import {
  Directive, Input, OnInit, Optional, HostBinding, ElementRef, Self, Inject, OnChanges, DoCheck, OnDestroy, HostListener
} from '@angular/core';
import { NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { FormFieldControl, ErrorStateMatcher, CanUpdateErrorStateCtor, mixinErrorState } from '../../_common/common';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { SBB_INPUT_VALUE_ACCESSOR } from '../input-value-accessor';
import { AutofillMonitor } from '@angular/cdk/text-field';

let nextId = 0;
const SBB_INPUT_INVALID_TYPES = [
  'button',
  'checkbox',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit'
];

/** @docs-private */
export class SbbNativeInputBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl) { }
}
export const _SbbNativeInputBase: CanUpdateErrorStateCtor & typeof SbbNativeInputBase =
  mixinErrorState(SbbNativeInputBase);

@Directive({
  selector: 'input[sbbNativeInput], select[sbbNativeInput], textarea[sbbNativeInput]',
  exportAs: 'sbbNativeInput',
  providers: [{ provide: FormFieldControl, useExisting: NativeInputDirective }],
})
export class NativeInputDirective extends _SbbNativeInputBase implements FormFieldControl<any>, OnInit, OnChanges, DoCheck, OnDestroy {
  private _previousNativeValue: any;
  private _inputValueAccessor: { value: any };
  /** The aria-describedby attribute on the input for improved a11y. */
  @HostBinding('attr.aria-describedby')
  _ariaDescribedby: string;

  /** Whether the component is a native html select. */
  _isNativeSelect = false;

  /** Whether the component is in an error state. */
  @HostBinding('attr.aria-invalid')
  errorState = false;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  focused = false;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  autofilled = false;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  @HostBinding()
  @Input()
  get disabled(): boolean {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  private _disabled = false;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  @HostBinding('attr.id')
  @Input()
  id = `sbb-native-input-${nextId++}`;

  get inputId() { return this.id; }

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  @HostBinding('attr.placeholder')
  @Input()
  placeholder: string;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  @HostBinding()
  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) { this._required = coerceBooleanProperty(value); }
  private _required = false;

  @HostBinding('attr.aria-required') get requiredAsString() { return this.required.toString(); }

  /** Input type of the element. */
  @Input()
  get type(): string { return this._type; }
  set type(value: string) {
    this._type = value || 'text';
    this._validateType();

    // When using Angular inputs, developers are no longer able to set the properties on the native
    // input element. To ensure that bindings for `type` work, we need to sync the setter
    // with the native property. Textarea elements don't support the type property or attribute.
    if (!this._isTextarea() && getSupportedInputTypes().has(this._type)) {
      (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }
  private _type = 'text';

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: ErrorStateMatcher;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): string { return this._inputValueAccessor.value; }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean { return this._readonly; }
  set readonly(value: boolean) { this._readonly = coerceBooleanProperty(value); }
  private _readonly = false;

  @HostBinding('attr.readonly')
  get readonlyAttribute() { return this.readonly && !this._isNativeSelect || undefined; }

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return !this._isNeverEmpty()
      && !this._elementRef.nativeElement.value
      && !this._isBadInput()
      && !this.autofilled;
  }

  private _neverEmptyInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'month',
    'time',
    'week'
  ].filter(t => getSupportedInputTypes().has(t));

  constructor(
    private _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    private _platform: Platform,
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() @Self() @Inject(SBB_INPUT_VALUE_ACCESSOR) inputValueAccessor: any,
    private _autofillMonitor: AutofillMonitor,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
    const element = this._elementRef.nativeElement;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    this._inputValueAccessor = inputValueAccessor || element;
    this._previousNativeValue = this.value;
    this._isNativeSelect = element.nodeName.toLowerCase() === 'select';
  }

  ngOnInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe(event => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    if (this._platform.isBrowser) {
      this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();
  }

  /** Focuses the input. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  @HostListener('blur', ['false'])
  @HostListener('focus', ['true'])
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /** Does some manual dirty checking on the native input `value` property. */
  private _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;
    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Make sure the input is a supported type. */
  private _validateType() {
    if (SBB_INPUT_INVALID_TYPES.indexOf(this._type) > -1) {
      throw new Error(`Input type "${this._type}" is not supported by sbbNativeInput!`);
    }
  }

  /** Checks whether the input type is one of the types that are never empty. */
  private _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }

  /** Checks whether the input is invalid based on the native validation. */
  private _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity && validity.badInput;
  }

  /** Determines if the component host is a textarea. */
  private _isTextarea() {
    return this._elementRef.nativeElement.nodeName.toLowerCase() === 'textarea';
  }
}
