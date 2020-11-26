import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SbbRadioButton, SbbRadioChange } from './radio-button';

let nextUniqueId = 0;

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'sbb-radio-group',
  exportAs: 'sbbRadioButtonGroup',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbRadioGroup),
      multi: true,
    },
  ],
  host: {
    class: 'sbb-radio-group',
    role: 'radiogroup',
  },
})
export class SbbRadioGroup<TRadio extends SbbRadioButton = SbbRadioButton>
  implements AfterContentInit, ControlValueAccessor {
  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  /**
   * Value for the radio-group. Should equal the value of the selected radio button if there is
   * a corresponding radio button with a matching value. If there is not such a corresponding
   * radio button, this value persists to be applied in case a new radio button is added with a
   * matching value.
   */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (this._value !== newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this._value = newValue;

      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }

  /**
   * The currently selected radio button. If set to a new radio button, the radio group value
   * will be updated to match the new selected button.
   */
  @Input()
  get selected(): TRadio | null {
    return this._selected;
  }
  set selected(selected: TRadio | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }

  /** Whether the radio group is disabled */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }

  /** Whether the radio group is required */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this._markRadiosForCheck();
  }

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  @Output() readonly change: EventEmitter<SbbRadioChange> = new EventEmitter<SbbRadioChange>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => SbbRadioButton), { descendants: true })
  _radios: QueryList<TRadio>;

  /** Selected value for the radio group. */
  private _value: any = null;

  /** The HTML name attribute applied to radio buttons in this group. */
  private _name = `sbb-radio-group-${nextUniqueId++}`;

  /** The currently selected radio button. Should match value. */
  private _selected: TRadio | null = null;

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized = false;

  /** Whether the radio group is disabled. */
  private _disabled = false;

  /** Whether the radio group is required. */
  private _required = false;

  /** `View -> model callback called when value changes` */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /** `View -> model callback called when radio group has been touched` */
  _onTouched: () => any = () => {};

  constructor(protected _changeDetector: ChangeDetectorRef) {}

  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  /**
   * Initialize properties once content children are available.
   * This allows us to propagate relevant attributes to associated buttons.
   */
  ngAfterContentInit() {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on RadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the RadioGroup.
    this._isInitialized = true;

    // TODO: Check if there is a solution for https://github.com/angular/components/issues/21148 and eventually remove following code
    this._updateSelectedRadioFromValue();
    this._checkSelectedRadioButton();
    Promise.resolve().then(() => {
      this._changeDetector.markForCheck();
    });
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this._onTouched) {
      this._onTouched();
    }
  }

  /** Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      // tslint:disable-next-line: no-non-null-assertion
      this.change.emit(new SbbRadioChange(this._selected!, this._value));
    }
  }

  _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }

  /** Sets the model value. Implemented as part of ControlValueAccessor. */
  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name = this.name;
        radio._markForCheck();
      });
    }
  }

  /** Updates the `selected` radio button from the internal _value state. */
  private _updateSelectedRadioFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach((radio) => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  // tslint:enable: member-ordering
}
