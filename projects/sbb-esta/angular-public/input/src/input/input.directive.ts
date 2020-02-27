import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorStateCtor, mixinErrorState } from '@sbb-esta/angular-core/common-behaviors';
import { ErrorStateMatcher } from '@sbb-esta/angular-core/error';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';

import { SBB_INPUT_VALUE_ACCESSOR } from '../input-value-accessor';

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
export class InputBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl
  ) {}
}
export const SbbNativeInputBase: CanUpdateErrorStateCtor & typeof InputBase = mixinErrorState(
  InputBase
);

@Directive({
  selector: 'input[sbbInput], select[sbbInput], textarea[sbbInput]',
  exportAs: 'sbbInput',
  providers: [{ provide: FormFieldControl, useExisting: InputDirective }]
})
export class InputDirective extends SbbNativeInputBase
  implements FormFieldControl<any>, OnInit, OnChanges, DoCheck, OnDestroy {
  private _previousNativeValue: any;
  private _inputValueAccessor: { value: any };
  /** The aria-describedby attribute on the input for improved a11y. */
  @HostBinding('attr.aria-describedby')
  ariaDescribedby: string;

  /** Whether the component is a native html select. */
  isNativeSelect = false;

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

  /**
   * @deprecated This will be replaced by an internal getter, based on the id property.
   */
  get inputId() {
    return this.id;
  }

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
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  private _required = false;

  @HostBinding('attr.aria-required') get requiredAsString() {
    return this.required.toString();
  }

  /** Input type of the element. */
  @Input()
  get type(): string {
    return this._type;
  }
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
  get value(): string {
    return this._inputValueAccessor.value;
  }
  set value(value: string) {
    if (value !== this.value) {
      this._inputValueAccessor.value = value;
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;

  @HostBinding('attr.readonly')
  get readonlyAttribute() {
    return (this.readonly && !this.isNativeSelect) || undefined;
  }

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return (
      !this._isNeverEmpty() &&
      !this._elementRef.nativeElement.value &&
      !this._isBadInput() &&
      !this.autofilled
    );
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
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl,
    private _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    private _platform: Platform,
    private _autofillMonitor: AutofillMonitor,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional()
    @Self()
    @Inject(SBB_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: any
  ) {
    super(defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);
    const element = this._elementRef.nativeElement;

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    this._inputValueAccessor = inputValueAccessor || element;
    this._previousNativeValue = this.value;
    this.isNativeSelect = element.nodeName.toLowerCase() === 'select';
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
  onFocusChanged(isFocused: boolean) {
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
    this.ariaDescribedby = ids.join(' ');
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
      throw new Error(`Input type "${this._type}" is not supported by sbbInput!`);
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
