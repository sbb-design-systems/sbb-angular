import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
  AutocompleteComponent,
  AutocompleteOriginDirective,
  SbbAutocompleteSelectedEvent
} from '@sbb-esta/angular-business/autocomplete';
import {
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  mixinErrorState
} from '@sbb-esta/angular-core/common-behaviors';
import { ErrorStateMatcher } from '@sbb-esta/angular-core/error';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';
import { Subject } from 'rxjs';

let nextUniqueId = 0;

/** Change event object that is emitted when the chip-input value has changed. */
export class SbbChipInputChange {
  constructor(
    /** Reference to the chip-input that emitted the change event. */
    public source: ChipInputComponent,
    /** Current value of the chip-input that emitted the event. */
    public value: string[]
  ) {}
}

// Boilerplate for applying mixins to SelectComponent.
/** @docs-private */
export class SbbChipsBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}

export const SbbChipsMixinBase: CanUpdateErrorStateCtor & typeof SbbChipsBase = mixinErrorState(
  SbbChipsBase
);

@Component({
  selector: 'sbb-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FormFieldControl, useExisting: ChipInputComponent }]
})
export class ChipInputComponent extends SbbChipsMixinBase
  implements
    FormFieldControl<any>,
    OnInit,
    DoCheck,
    OnDestroy,
    OnChanges,
    CanUpdateErrorState,
    ControlValueAccessor {
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
    this._changeDetectorRef.markForCheck();
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
  @HostBinding('class.sbb-chip-input-required')
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /** @docs-private */
  @HostBinding('class.sbb-chip-input-active')
  get _isActive() {
    return !this.disabled && this._focused;
  }

  @ViewChild('chipInputTextfield', { static: false })
  inputElement: ElementRef;

  /** Value of the chip input control. */
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
    }
  }
  private _value: string[] = [];

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  get inputId() {
    return this.id;
  }

  /** Whether the chip-input has a value. */
  get empty(): boolean {
    return !this.selectionModel || this.selectionModel.isEmpty();
  }

  /**
   * Event that emits whenever the raw value of the chip-input changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Whether the select is focused.
   * Note: Setting focused will be removed in the next major release
   * */
  get focused(): boolean {
    return this._focused;
  }
  set focused(focused: boolean) {
    // TODO remove setter
    this._focused = focused;
  }
  private _focused = false;

  inputModel = '';
  origin = new AutocompleteOriginDirective(this._elementRef);
  selectionModel: SelectionModel<string>;

  /** Whether filling out the chip-input is required in the form. */
  private _required = false;

  /** The aria-describedby attribute on the chip-input for improved a11y. */
  private _ariaDescribedby: string;

  /** Unique id for this input. */
  private _uid = `sbb-chip-input-${nextUniqueId++}`;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  private _onTouchedCallback: () => void = () => {};
  private _onChangeCallback: (_: any) => void = () => {};

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private _changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective
  ) {
    super(elementRef, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);

    this.selectionModel = new SelectionModel<string>(true);
    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  ngOnInit(): void {
    if (this.autocomplete) {
      this.autocomplete.optionSelected.subscribe((event: SbbAutocompleteSelectedEvent) =>
        this.onSelect(event.option.value)
      );
    }
  }

  /**
   * Sets the chip input's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: string[]): void {
    this.selectionModel.clear();
    if (Array.isArray(value)) {
      value.forEach(v => this.selectionModel.select(v));
    }
    this._propagateChanges();
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
    if (!option) {
      return;
    } else if (!this.selectionModel.isSelected(option)) {
      this.selectionModel.select(option);
      this._onTouchedCallback();
      this._propagateChanges();
    }
    this.inputElement.nativeElement.value = '';
  }

  /**
   * Selects a given value if the action doesn't refer to an autocomplete option
   */
  onEnter(option: string) {
    if (this.autocomplete) {
      if (!this.autocomplete.options.some(opt => opt.active)) {
        this.onSelect(option);
      }
    } else {
      this.onSelect(option);
    }
  }

  /**
   * Removes a given value from the current selected values.
   */
  deselectOption(option: string) {
    if (this.selectionModel.isSelected(option)) {
      this.selectionModel.deselect(option);
      this._onTouchedCallback();
      this._propagateChanges();
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

  /**
   * Forward focus if a user clicks on an associated label.
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  onContainerClick(event: Event): void {
    this.inputElement.nativeElement.focus();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    this._value = this.selectionModel.selected;
    this._onChangeCallback(this.selectionModel.selected);
    this.valueChange.emit(new SbbChipInputChange(this, this._value));
    this._changeDetectorRef.markForCheck();
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
    // the parent form field know to run change detection when the disabled state changes.
    if (changes.disabled) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  /**
   * @docs-private
   */
  _onBlur() {
    this._focused = false;

    if (!this.disabled) {
      this._onTouchedCallback();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /**
   * @docs-private
   */
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }
}
