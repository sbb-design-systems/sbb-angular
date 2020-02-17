import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Output,
  Self
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  AutocompleteComponent,
  AutocompleteOriginDirective
} from '@sbb-esta/angular-business/autocomplete';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';
import { SBB_OPTION_PARENT_COMPONENT } from '@sbb-esta/angular-public';
import { Subject } from 'rxjs';

let nextUniqueId = 0;

@Component({
  selector: 'sbb-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [{ provide: SBB_OPTION_PARENT_COMPONENT, useExisting: ChipInputComponent }]
})
export class ChipInputComponent implements FormFieldControl<any>, OnInit {
  /** Value of the select control. */
  @Input()
  options: string[] = [];

  /** Optional autocomplete Component */
  @Input('sbbAutocomplete')
  autocomplete: AutocompleteComponent;

  /** Disables the chip input */
  @Input()
  @HostBinding('class.sbb-chip-input-disabled')
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  /** Unique id of the element. */
  @Input()
  @HostBinding('attr.id')
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  /** Whether the component is required. */
  @HostBinding('class.sbb-select-required')
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @HostBinding('class.sbb-chip-input-active')
  get isActive() {
    return !this.disabled && this.focused;
  }

  /** Value of the chip input control. */
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (newValue !== this._value) {
      this._value = newValue;
    }
  }
  private _value: any;

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  get inputId() {
    return this.id;
  }

  /** Whether the select has a value. */
  get empty(): boolean {
    return !this.value || this.value.isEmpty();
  }

  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  focused = false;
  errorState: boolean;
  inputModel = '';
  origin = new AutocompleteOriginDirective(this._elementRef);

  private _onTouchedCallback: () => void;
  private _onChangeCallback: (_: any) => void;

  /** Whether filling out the select is required in the form. */
  private _required = false;

  /** The aria-describedby attribute on the select for improved a11y. */
  private _ariaDescribedby: string;

  /** Unique id for this input. */
  private _uid = `sbb-select-${nextUniqueId++}`;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  ngOnInit(): void {
    if (this.autocomplete) {
      this.autocomplete.optionSelected.subscribe(event => this.onSelect(event.option.value));
    }
  }

  /**
   * Sets the chip input's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: string[]): void {
    if (value) {
      this.value = value;
    } else {
      this.value = [];
    }
  }

  /**
   * Disables the chip input. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /**
   * Adds a given value to the current selected values.
   */
  onSelect(option: string) {
    if (!this.value) {
      this.value = [];
    }
    if (!this.value.includes(option)) {
      this.writeValue(this.value.concat([option]));
      this._onChangeCallback(this.value);
      this._onTouchedCallback();
    }
    setTimeout(() => {
      this.inputModel = null;
    });
  }

  /**
   * Removes a given value from the current selected values.
   */
  deselectOption(option: string) {
    const index = this.value.findIndex(opt => opt === option);
    if (index >= 0) {
      this.value.splice(index, 1);
      if (this.value.length === 0) {
        this.value = null;
      }
      this._onChangeCallback(this.value);
      this._onTouchedCallback();
    }
  }

  /**
   * Saves a callback function to be invoked when the chip input's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  /**
   * Saves a callback function to be invoked when the chip input is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }
}
