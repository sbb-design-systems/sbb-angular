import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, hasModifierKey, TAB } from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  SbbAutocompleteSelectedEvent,
  SbbAutocompleteTrigger,
} from '@sbb-esta/angular/autocomplete';
import { TypeRef } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SbbChipsDefaultOptions, SBB_CHIPS_DEFAULT_OPTIONS } from './chip-default-options';
import type { SbbChipList } from './chip-list';
import { SbbChipTextControl } from './chip-text-control';
import { SBB_CHIP_LIST } from './chip-tokens';

/** Represents an input event on a `sbbChipInput`. */
export interface SbbChipInputEvent {
  /** The value of the input. */
  value: string;

  /**
   * Reference to the chip input that emitted the event.
   */
  chipInput: SbbChipInput;
}

// Increasing integer for generating unique ids.
let nextUniqueId = 0;

/**
 * Directive that adds chip-specific behaviors to an input element inside `<sbb-form-field>`.
 * May be placed inside or outside of an `<sbb-chip-list>`.
 */
@Directive({
  selector: 'input[sbbChipInputFor], input[sbbChipInput]',
  exportAs: 'sbbChipInput, sbbChipInputFor',
  host: {
    class: 'sbb-chip-input sbb-input-element',
    '(keydown)': '_keydown($event)',
    '(keyup)': '_keyup($event)',
    '(blur)': '_blur()',
    '(focus)': '_focus()',
    '(input)': '_onInput()',
    '[id]': 'id',
    '[attr.disabled]': 'disabled || null',
    '[attr.placeholder]': 'placeholder || null',
    '[attr.aria-invalid]': '_chipList && _chipList.ngControl ? _chipList.ngControl.invalid : null',
    '[attr.aria-required]': '_chipList && _chipList.required || null',
  },
})
export class SbbChipInput implements SbbChipTextControl, OnChanges, OnDestroy, AfterContentInit {
  /** Used to prevent focus moving to chips while user is holding backspace */
  private _focusLastChipOnBackspace: boolean;

  /** Whether the control is focused. */
  focused: boolean = false;
  _chipList: SbbChipList;

  private _destroyed = new Subject<void>();

  /** Register input for chip list */
  @Input('sbbChipInputFor')
  set chipList(value: SbbChipList) {
    if (value) {
      this._chipList = value;
      this._chipList.registerInput(this);
    }
  }

  /**
   * Whether the chipEnd event will be emitted when the input is blurred.
   */
  @Input('sbbChipInputAddOnBlur')
  get addOnBlur(): boolean {
    return this._addOnBlur;
  }
  set addOnBlur(value: BooleanInput) {
    this._addOnBlur = coerceBooleanProperty(value);
  }
  _addOnBlur: boolean = false;

  /**
   * The list of key codes that will trigger a chipEnd event.
   *
   * Defaults to `[ENTER]`.
   */
  @Input('sbbChipInputSeparatorKeyCodes')
  separatorKeyCodes: readonly number[] | ReadonlySet<number> =
    this._defaultOptions.separatorKeyCodes;

  /**
   * Emitted when a chip is to be added.
   *
   * If a FormControl (Array or Set) on the sbb-chip-list is present and no subscriber
   * listens to (sbbChipInputTokenEnd), the input value will automatically be added to
   * the FormControl collection.
   */
  @Output('sbbChipInputTokenEnd') readonly chipEnd = new EventEmitter<SbbChipInputEvent>();

  /** The input's placeholder text. */
  @Input() placeholder: string = '';

  /** Unique id for the input. */
  @Input() id: string = `sbb-chip-list-input-${nextUniqueId++}`;

  /** Whether the input is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled || (this._chipList && this._chipList.disabled);
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled: boolean = false;

  /** Whether the input is empty. */
  get empty(): boolean {
    return !this.inputElement.value;
  }

  /** The native input element to which this directive is attached. */
  readonly inputElement!: HTMLInputElement;

  constructor(
    protected _elementRef: ElementRef<HTMLInputElement>,
    @Inject(SBB_CHIPS_DEFAULT_OPTIONS) private _defaultOptions: SbbChipsDefaultOptions,
    @Self() @Optional() public autocompleteTrigger?: SbbAutocompleteTrigger,
    @Host() @Optional() @Inject(SBB_CHIP_LIST) chipList?: TypeRef<SbbChipList>,
    @Self() @Optional() private _ngControl?: NgControl
  ) {
    this.inputElement = this._elementRef.nativeElement as HTMLInputElement;

    if (chipList) {
      this.chipList = chipList;
    }
  }

  ngOnChanges(): void {
    this._chipList.stateChanges.next();
  }

  ngOnDestroy(): void {
    this.chipEnd.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  ngAfterContentInit(): void {
    this._focusLastChipOnBackspace = this.empty;

    // Try to add autocomplete selected value to FormControl.
    // Skip this part, if there are already other observers which might have its own logic.
    if (this.autocompleteTrigger && this.autocompleteTrigger.autocomplete) {
      this.autocompleteTrigger.autocomplete.optionSelected
        .pipe(
          filter(
            () => this.autocompleteTrigger?.autocomplete.optionSelected.observers.length === 1
          ),
          takeUntil(this._destroyed)
        )
        .subscribe((selectedEvent: SbbAutocompleteSelectedEvent) => {
          this._addValueToControl(selectedEvent.option.viewValue);
          this.chipEnd.emit({
            value: selectedEvent.option.viewValue,
            chipInput: this,
          });
        });
    }
  }

  /** Utility method to make host definition/tests more clear. */
  _keydown(event?: KeyboardEvent) {
    if (event) {
      // Allow the user's focus to escape when they're tabbing forward. Note that we don't
      // want to do this when going backwards, because focus should go back to the first chip.
      if (event.keyCode === TAB && !hasModifierKey(event, 'shiftKey')) {
        this._chipList._allowFocusEscape();
      }

      // To prevent the user from accidentally deleting chips when pressing BACKSPACE continuously,
      // We focus the last chip on backspace only after the user has released the backspace button,
      // and the input is empty (see behaviour in _keyup)
      if (event.keyCode === BACKSPACE && this._focusLastChipOnBackspace) {
        this._chipList._keyManager.setLastItemActive();
        event.preventDefault();
        return;
      } else {
        this._focusLastChipOnBackspace = false;
      }
    }

    // If an autocomplete is open, we have to ensure that the (optionSelected) listener
    // is called before this._emitChipEnd is called. The (optionSelected) listener clears
    // the input and therefore we can prevent adding the current chip input value to the formControl.
    // If not using this logic, the current chip input value will be added together
    // with the selected autocomplete value.
    if (this.autocompleteTrigger?.autocomplete.isOpen) {
      Promise.resolve().then(() => this._emitChipEnd(event));
    } else {
      this._emitChipEnd(event);
    }
  }

  /**
   * Pass events to the keyboard manager. Available here for tests.
   */
  _keyup(event: KeyboardEvent) {
    // Allow user to move focus to chips next time he presses backspace
    if (!this._focusLastChipOnBackspace && event.keyCode === BACKSPACE && this.empty) {
      this._focusLastChipOnBackspace = true;
      event.preventDefault();
    }
  }

  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    // Blur the chip list if it is not focused
    if (!this._chipList.focused) {
      this._chipList._blur();
    }
    this._chipList.stateChanges.next();
  }

  _focus() {
    this.focused = true;
    this._chipList.stateChanges.next();
  }

  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event?: KeyboardEvent) {
    if (!this.inputElement.value && !!event) {
      this._chipList._keydown(event);
    }

    if (!event || this._isSeparatorKey(event)) {
      this._addValueToControl(this.inputElement.value);

      this.chipEnd.emit({
        value: this.inputElement.value,
        chipInput: this,
      });

      event?.preventDefault();
    }
  }

  private _addValueToControl(inputValue: string) {
    if (!this._chipList?.ngControl?.control || inputValue === '' || this.chipEnd.observers.length) {
      return;
    }
    const control = this._chipList.ngControl.control;
    const currentCollection = control.value;
    const isArray = Array.isArray(currentCollection);
    const isSet = currentCollection instanceof Set;
    if (isArray) {
      control.patchValue([...currentCollection, inputValue]);
    } else if (isSet) {
      control.patchValue(new Set([...currentCollection, inputValue]));
    }
    if (isArray || isSet) {
      this._chipList.ngControl.control.markAsDirty();
      this.clear();
    }
  }

  _onInput() {
    // Let chip list know whenever the value changes.
    this._chipList.stateChanges.next();
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this.inputElement.focus(options);
  }

  /** Clears the input */
  clear(): void {
    this.inputElement.value = '';
    this._ngControl?.control?.setValue(null);
    this._focusLastChipOnBackspace = true;
  }

  /** Checks whether a keycode is one of the configured separators. */
  private _isSeparatorKey(event: KeyboardEvent) {
    return !hasModifierKey(event) && new Set(this.separatorKeyCodes).has(event.keyCode);
  }
}
