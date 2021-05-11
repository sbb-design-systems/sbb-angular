import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import { ENTER } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
  SbbAutocomplete,
  SbbAutocompleteOrigin,
  SbbAutocompleteSelectedEvent,
} from '@sbb-esta/angular-business/autocomplete';
import {
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  mixinErrorState,
} from '@sbb-esta/angular-core/common-behaviors';
import { SbbErrorStateMatcher } from '@sbb-esta/angular-core/error';
import { SbbFormFieldControl } from '@sbb-esta/angular-core/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

let nextId = 0;

/** Change event object that is emitted when the chip-input value has changed. */
export class SbbChipInputChange {
  constructor(
    /** Reference to the chip-input that emitted the change event. */
    public source: SbbChipInput,
    /** Current value of the chip-input that emitted the event. */
    public value: string[]
  ) {}
}

// Boilerplate for applying mixins to SelectComponent.
/** @docs-private */
export class SbbChipsBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: SbbErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}

export const SbbChipsMixinBase: CanUpdateErrorStateCtor & typeof SbbChipsBase =
  mixinErrorState(SbbChipsBase);

@Component({
  selector: 'sbb-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-chip-input',
    '[id]': 'id',
    '[class.sbb-chip-input-active]': '!this.disabled && this.focused',
    '[class.sbb-chip-input-disabled]': 'this.disabled',
    '[class.sbb-chip-input-required]': 'this.required',
    '[attr.aria-describedby]': 'this._ariaDescribedby',
  },
  providers: [{ provide: SbbFormFieldControl, useExisting: SbbChipInput }],
})
export class SbbChipInput
  extends SbbChipsMixinBase
  implements
    SbbFormFieldControl<any>,
    OnInit,
    DoCheck,
    OnDestroy,
    OnChanges,
    CanUpdateErrorState,
    ControlValueAccessor
{
  /** Optional autocomplete Component */
  @Input('sbbAutocomplete')
  autocomplete: SbbAutocomplete;

  /** Disables the chip input */
  @Input()
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
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uniqueId;
    this.stateChanges.next();
  }
  private _id: string;

  /** Id for the inner input field. */
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Whether filling out the chip-input is required in the form. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  /** Reference to the input element. */
  @ViewChild('chipInputTextfield', { static: false }) _inputElement: ElementRef;

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

  /** Whether the select is focused. */
  get focused(): boolean {
    return this._focused;
  }
  private _focused = false;

  inputModel: string = '';
  selectionModel: SelectionModel<string>;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  /** The element reference for the autocomplete origin. */
  readonly _origin = new SbbAutocompleteOrigin(this._elementRef);

  /** The aria-describedby attribute on the chip-input for improved a11y. */
  _ariaDescribedby: string;

  /** Unique id for this input. */
  private _uniqueId = `sbb-chip-input-${nextId++}`;

  private _destroyed = new Subject<void>();

  /** `View -> model callback called when value changes` */
  private _onTouched: () => void = () => {};
  /** `View -> model callback called when chip input has been touched` */
  private _onChange: (_: any) => void = () => {};

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private _changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    defaultErrorStateMatcher: SbbErrorStateMatcher,
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
      this.autocomplete.optionSelected
        .pipe(takeUntil(this._destroyed))
        .subscribe((event: SbbAutocompleteSelectedEvent) => this._onSelect(event.option.value));

      this.autocomplete.opened.pipe(takeUntil(this._destroyed)).subscribe(() => {
        this._elementRef.nativeElement.classList.add('sbb-chip-input-autocomplete-expanded');
      });
      this.autocomplete.closed.pipe(takeUntil(this._destroyed)).subscribe(() => {
        this._elementRef.nativeElement.classList.remove('sbb-chip-input-autocomplete-expanded');
      });
    }
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
    this._destroyed.next();
    this._destroyed.complete();
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
      value.forEach((v) => this.selectionModel.select(v));
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

  /** Adds a given value to the current selected values. */
  _onSelect(option: string) {
    if (!option) {
      return;
    } else if (!this.selectionModel.isSelected(option)) {
      this.selectionModel.select(option);
      this._onTouched();
      this._propagateChanges();
    }
    this._inputElement.nativeElement.value = '';
  }

  /** Handle the keydown event. */
  _handleKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const currentValue = this._inputElement.nativeElement.value;
    if (keyCode !== ENTER || !currentValue) {
      return;
    }

    event.preventDefault();
    if (this.autocomplete) {
      if (!this.autocomplete.options.some((opt) => opt.active)) {
        this._onSelect(currentValue);
      }
    } else {
      this._onSelect(currentValue);
    }
  }

  /** Removes a given value from the current selected values. */
  deselectOption(option: string) {
    if (this.selectionModel.isSelected(option)) {
      this.selectionModel.deselect(option);
      this._onTouched();
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
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the chip input is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Forward focus if a user clicks on an associated label.
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  onContainerClick(event: Event): void {
    this._inputElement.nativeElement.focus();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    this._value = this.selectionModel.selected;
    this._onChange(this.selectionModel.selected);
    this.valueChange.emit(new SbbChipInputChange(this, this._value));
    this._changeDetectorRef.markForCheck();
  }

  /** @docs-private */
  _onBlur() {
    this._focused = false;

    if (!this.disabled) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** @docs-private */
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
  // tslint:enable: member-ordering
}
