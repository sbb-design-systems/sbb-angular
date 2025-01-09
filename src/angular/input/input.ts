import { _IdGenerator } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { getSupportedInputTypes, Platform } from '@angular/cdk/platform';
import { AutofillMonitor } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  Directive,
  DoCheck,
  effect,
  ElementRef,
  HostListener,
  inject,
  Input,
  isSignal,
  NgZone,
  numberAttribute,
  OnChanges,
  OnDestroy,
  WritableSignal,
} from '@angular/core';
import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { SbbErrorStateMatcher, _ErrorStateTracker } from '@sbb-esta/angular/core';
import { SbbFormFieldControl } from '@sbb-esta/angular/form-field';
import { Subject } from 'rxjs';

import { getSbbInputUnsupportedTypeError } from './input-errors';
import { SBB_INPUT_VALUE_ACCESSOR } from './input-value-accessor';

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

/** Directive that allows a native input to work inside a `SbbFormField`. */
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
    '[attr.name]': 'name || null',
    '[attr.readonly]': 'readonly && !_isNativeSelect || null',
    // Only mark the input as invalid for assistive technology if it has a value since the
    // state usually overlaps with `aria-required` when the input is empty and can be redundant.
    '[attr.aria-invalid]': '(empty && required) ? null : errorState',
    '[attr.aria-required]': 'required',
    '[attr.placeholder]': `!readonly ? (placeholder || null) : '-'`,
    '[attr.tabindex]': `empty && readonly ? -1  : tabIndex`,
  },
  providers: [{ provide: SbbFormFieldControl, useExisting: SbbInput }],
})
export class SbbInput
  implements SbbFormFieldControl<any>, AfterViewInit, OnChanges, DoCheck, OnDestroy
{
  private _elementRef =
    inject<ElementRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>(ElementRef);
  private _platform = inject(Platform);
  private _autofillMonitor = inject(AutofillMonitor);
  private _previousNativeValue: any;
  private _inputValueAccessor: { value: any };
  private _signalBasedValueAccessor?: { value: WritableSignal<any> };
  private _errorStateTracker: _ErrorStateTracker;
  ngControl: NgControl = inject(NgControl, { optional: true, self: true })!;

  /** Whether the component is a native html select. */
  readonly _isNativeSelect: boolean;

  /** Whether the component is a textarea. */
  readonly _isTextarea: boolean;

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
  stateChanges: Subject<void> = new Subject<void>();

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
  set disabled(value: BooleanInput) {
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
  @Input() id: string = inject(_IdGenerator).getId('sbb-native-input-');

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input() placeholder: string;

  /**
   * Name of the input.
   * @docs-private
   */
  @Input() name: string;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
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
  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: SbbErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

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
    return this._signalBasedValueAccessor
      ? this._signalBasedValueAccessor.value()
      : this._inputValueAccessor.value;
  }
  // Accept `any` to avoid conflicts with other directives on `<input>` that may
  // accept different types.
  set value(value: any) {
    if (value !== this.value) {
      if (this._signalBasedValueAccessor) {
        this._signalBasedValueAccessor.value.set(value);
      } else {
        this._inputValueAccessor.value = value;
      }
      this.stateChanges.next();
    }
  }

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;
  /** Tab index of the input. */
  @Input({
    transform: (value: unknown) => (value == null ? undefined : numberAttribute(value)),
  })
  tabIndex: number;

  /** Whether the input is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

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

  constructor(...args: unknown[]);
  constructor() {
    const parentForm = inject(NgForm, { optional: true })!;
    const parentFormGroup = inject(FormGroupDirective, { optional: true })!;
    const defaultErrorStateMatcher = inject(SbbErrorStateMatcher);
    const accessor = inject(SBB_INPUT_VALUE_ACCESSOR, { optional: true, self: true })!;
    const ngZone = inject(NgZone);

    const element = this._elementRef.nativeElement;
    const nodeName = element.nodeName.toLowerCase();

    if (accessor) {
      if (isSignal(accessor.value)) {
        this._signalBasedValueAccessor = accessor;
      } else {
        this._inputValueAccessor = accessor;
      }
    } else {
      // If no input value accessor was explicitly specified, use the element as the input value
      // accessor.
      this._inputValueAccessor = element;
    }

    this._previousNativeValue = this.value;

    // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
    // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
    // exists on iOS, we only bother to install the listener on iOS.
    if (this._platform.IOS) {
      ngZone.runOutsideAngular(() => {
        this._elementRef.nativeElement.addEventListener('keyup', this._iOSKeyupListener);
      });
    }
    this._errorStateTracker = new _ErrorStateTracker(
      defaultErrorStateMatcher,
      this.ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges,
    );
    this._isNativeSelect = nodeName === 'select';
    this._isTextarea = nodeName === 'textarea';

    if (this._isNativeSelect) {
      this.controlType = (element as HTMLSelectElement).multiple
        ? 'sbb-native-select-multiple'
        : 'sbb-native-select';
    }

    if (this._signalBasedValueAccessor) {
      effect(() => {
        // Read the value so the effect can register the dependency.
        this._signalBasedValueAccessor!.value();
        this.stateChanges.next();
      });
    }
  }

  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((event) => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
    }

    if (this._platform.IOS) {
      this._elementRef.nativeElement.removeEventListener('keyup', this._iOSKeyupListener);
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

  /** Refreshes the error state of the input. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** Callback for the cases where the focused state of the input changes. */
  @HostListener('focus', ['true'])
  @HostListener('blur', ['false'])
  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.stateChanges.next();
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
    if (
      SBB_INPUT_INVALID_TYPES.indexOf(this._type) > -1 &&
      (typeof ngDevMode === 'undefined' || ngDevMode)
    ) {
      throw getSbbInputUnsupportedTypeError(this._type);
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
  setDescribedByIds(ids: string[]) {
    if (ids.length) {
      this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this._elementRef.nativeElement.removeAttribute('aria-describedby');
    }
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

  private _iOSKeyupListener = (event: Event): void => {
    const el = event.target as HTMLInputElement;

    // Note: We specifically check for 0, rather than `!el.selectionStart`, because the two
    // indicate different things. If the value is 0, it means that the caret is at the start
    // of the input, whereas a value of `null` means that the input doesn't support
    // manipulating the selection range. Inputs that don't support setting the selection range
    // will throw an error so we want to avoid calling `setSelectionRange` on them. See:
    // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
    if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
      // Note: Just setting `0, 0` doesn't fix the issue. Setting
      // `1, 1` fixes it for the first time that you type text and
      // then hold delete. Toggling to `1, 1` and then back to
      // `0, 0` seems to completely fix it.
      el.setSelectionRange(1, 1);
      el.setSelectionRange(0, 0);
    }
  };
}
