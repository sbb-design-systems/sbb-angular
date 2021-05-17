import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  Directive,
  DoCheck,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { CanUpdateErrorStateCtor, mixinErrorState } from '@sbb-esta/angular-core/common-behaviors';
import { SbbErrorStateMatcher } from '@sbb-esta/angular-core/error';
import { SbbFormFieldControl } from '@sbb-esta/angular-core/forms';

import { SBB_INPUT_VALUE_ACCESSOR } from './input-value-accessor';

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
  'submit',
];

/** @docs-private */
export class SbbInputBase {
  constructor(
    public _defaultErrorStateMatcher: SbbErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    /** @docs-private */
    public ngControl: NgControl
  ) {}
}
export const SbbNativeInputBase: CanUpdateErrorStateCtor & typeof SbbInputBase =
  mixinErrorState(SbbInputBase);

@Directive({
  selector: 'input[sbbInput], select[sbbInput], textarea[sbbInput]',
  exportAs: 'sbbInput',
  host: {
    class: 'sbb-input-element',
    // Native input properties that are overwritten by Angular inputs need to be synced with
    // the native input element. Otherwise property bindings for those don't work.
    '[attr.id]': 'id',
    '[disabled]': 'disabled',
    '[required]': 'required',
    '[attr.readonly]': 'readonly && !_isNativeSelect || null',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-required]': 'required.toString()',
    '[attr.placeholder]': 'placeholder || null',
  },
  providers: [{ provide: SbbFormFieldControl, useExisting: SbbInput }],
})
export class SbbInput
  extends SbbNativeInputBase
  implements SbbFormFieldControl<any>, OnInit, OnChanges, DoCheck, OnDestroy
{
  private _previousNativeValue: any;
  private _inputValueAccessor: { value: any };

  /** Whether the component is a native html select. */
  readonly _isNativeSelect: boolean;

  /** Whether the component is a textarea. */
  readonly _isTextarea: boolean;

  /** Whether the component is in an error state. */
  errorState: boolean = false;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  focused: boolean = false;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  controlType: string = 'sbb-input';

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  autofilled: boolean = false;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
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
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input() id: string = `sbb-native-input-${nextId++}`;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input() placeholder: string;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  private _required = false;

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
    if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
      (this._elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
  }
  private _type = 'text';

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher: SbbErrorStateMatcher;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input('aria-describedby') userAriaDescribedBy: string;

  /**
   * Implemented as part of SbbFormFieldControl.
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

  /**
   * Implemented as part of SbbFormFieldControl.
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
    'week',
  ].filter((t) => getSupportedInputTypes().has(t));

  constructor(
    private _elementRef: ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    private _platform: Platform,
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    defaultErrorStateMatcher: SbbErrorStateMatcher,
    @Optional()
    @Self()
    @Inject(SBB_INPUT_VALUE_ACCESSOR)
    inputValueAccessor: any,
    private _autofillMonitor: AutofillMonitor
  ) {
    super(defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);
    const element = this._elementRef.nativeElement;
    const nodeName = element.nodeName.toLowerCase();

    // If no input value accessor was explicitly specified, use the element as the input value
    // accessor.
    this._inputValueAccessor = inputValueAccessor || element;
    this._previousNativeValue = this.value;

    this._isNativeSelect = nodeName === 'select';
    this._isTextarea = nodeName === 'textarea';

    if (this._isNativeSelect) {
      this.controlType = (element as HTMLSelectElement).multiple
        ? 'sbb-native-select-multiple'
        : 'sbb-native-select';
    }
  }

  ngOnInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((event) => {
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
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused && (!this.readonly || !isFocused)) {
      this.focused = isFocused;
      this.stateChanges.next();
    }
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    if (ids.length) {
      this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this._elementRef.nativeElement.removeAttribute('aria-describedby');
    }
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

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  static ngAcceptInputType_readonly: BooleanInput;
  // Accept `any` to avoid conflicts with other directives on `<input>` that may
  // accept different types.
  static ngAcceptInputType_value: any;
  // tslint:enable: member-ordering
}
