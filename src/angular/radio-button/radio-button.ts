import { FocusMonitor, FocusOrigin, _IdGenerator } from '@angular/cdk/a11y';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterContentInit,
  afterNextRender,
  AfterViewInit,
  Attribute,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  inject,
  Inject,
  InjectionToken,
  Injector,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TypeRef } from '@sbb-esta/angular/core';
import { Subscription } from 'rxjs';

/**
 * Provider Expression that allows sbb-radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 * @docs-private
 */
export const SBB_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SbbRadioGroup),
  multi: true,
};

/** Change event object emitted by SbbRadio and SbbRadioGroup. */
export class SbbRadioChange<T = any> {
  constructor(
    /** The SbbRadioButton that emits the change event. */
    public source: _SbbRadioButtonBase,
    /** The value of the SbbRadioButton. */
    public value: T,
  ) {}
}

/**
 * Injection token that can be used to inject instances of `SbbRadioGroup`. It serves as
 * alternative token to the actual `SbbRadioGroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const SBB_RADIO_GROUP = new InjectionToken<_SbbRadioGroupBase<_SbbRadioButtonBase>>(
  'SbbRadioGroup',
);

/**
 * Injection token that can be used to inject instances of `_SbbRadioButtonBase`
 * implementations. It serves as alternative token to the actual `_SbbRadioButtonBase`
 * class which could cause unnecessary retention of the class and its component metadata.
 */
export const SBB_RADIO_BUTTON = new InjectionToken<_SbbRadioButtonBase>('SbbRadioButton');

@Directive({
  host: {
    class: 'sbb-radio-group-base',
  },
})
// tslint:disable-next-line: naming-convention class-name
export abstract class _SbbRadioGroupBase<TRadio extends _SbbRadioButtonBase>
  implements AfterContentInit, OnDestroy, ControlValueAccessor
{
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
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._markRadiosForCheck();
  }

  /** Whether the radio group is required */
  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = value;
    this._markRadiosForCheck();
  }

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  @Output() readonly change: EventEmitter<SbbRadioChange> = new EventEmitter<SbbRadioChange>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => SBB_RADIO_BUTTON), { descendants: true })
  _radios: QueryList<TRadio>;

  /** Selected value for the radio group. */
  private _value: any = null;

  /** The HTML name attribute applied to radio buttons in this group. */
  private _name = inject(_IdGenerator).getId('sbb-radio-group-');

  /** The currently selected radio button. Should match value. */
  private _selected: TRadio | null = null;

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized = false;

  /** Whether the radio group is disabled. */
  private _disabled = false;

  /** Whether the radio group is required. */
  private _required = false;

  /** Subscription to changes in amount of radio buttons. */
  private _buttonChanges: Subscription;

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

    // Clear the `selected` button when it's destroyed since the tabindex of the rest of the
    // buttons depends on it. Note that we don't clear the `value`, because the radio button
    // may be swapped out with a similar one and there are some internal apps that depend on
    // that behavior.
    this._buttonChanges = this._radios.changes.subscribe(() => {
      if (this.selected && !this._radios.find((radio) => radio === this.selected)) {
        this._selected = null;
      }
    });
  }

  ngOnDestroy() {
    this._buttonChanges?.unsubscribe();
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this._onTouched) {
      this._onTouched();
      this._changeDetector.markForCheck();
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
}

@Directive({
  selector: 'sbb-radio-group',
  exportAs: 'sbbRadioGroup',
  providers: [
    SBB_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
    { provide: SBB_RADIO_GROUP, useExisting: SbbRadioGroup },
  ],
  host: {
    class: 'sbb-radio-group',
    role: 'radiogroup',
  },
})
export class SbbRadioGroup<
  TRadio extends _SbbRadioButtonBase = SbbRadioButton,
> extends _SbbRadioGroupBase<TRadio> {
  @ContentChildren(forwardRef(() => SBB_RADIO_BUTTON), { descendants: true })
  // We need an initializer here to avoid a TS error.
  override _radios: QueryList<TRadio> = undefined!;
}

let nextId = 0;

@Directive()
// tslint:disable-next-line: naming-convention class-name
export class _SbbRadioButtonBase implements OnInit, AfterViewInit, DoCheck, OnDestroy {
  private _uniqueId = `sbb-radio-button-${++nextId}`;

  /** The id of this component. */
  @Input() @HostBinding('attr.id') id: string = this._uniqueId;

  /** Analog to HTML 'name' attribute used to group radios for unique selection. */
  @Input() name: string;

  /** Used to set the 'aria-label' attribute on the underlying input element. */
  @Input('aria-label') ariaLabel: string;

  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  @Input('aria-describedby') ariaDescribedby: string;

  /** Tabindex of the radio button. */
  @Input({ transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)) })
  tabIndex: number = 0;

  /** Whether this radio button is checked. */
  @Input({ transform: booleanAttribute })
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    if (this._checked !== value) {
      this._checked = value;
      if (value && this.radioGroup && this.radioGroup.value !== this.value) {
        this.radioGroup.selected = this;
      } else if (!value && this.radioGroup && this.radioGroup.value === this.value) {
        // When unchecking the selected radio button, update the selected radio
        // property on the group.
        this.radioGroup.selected = null;
      }

      if (value) {
        // Notify all radio buttons with the same name to un-check.
        this._radioDispatcher.notify(this.id, this.name);
      }
      this._changeDetector.markForCheck();
    }
  }

  /** The value of this radio button. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          // Update checked when the value changed to match the radio group's value
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }

  /** Whether the radio button is disabled. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
  }
  set disabled(value: boolean) {
    this._setDisabled(value);
  }

  /** Whether the radio button is required. */
  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required || (this.radioGroup && this.radioGroup.required);
  }
  set required(value: boolean) {
    this._required = value;
  }

  /**
   * Event emitted when the checked state of this radio button changes.
   * Change events are only emitted when the value changes due to user interaction with
   * the radio button (the same behavior as `<input type-"radio">`).
   */
  @Output() readonly change: EventEmitter<SbbRadioChange> = new EventEmitter<SbbRadioChange>();

  /** The parent radio group. May or may not be present. */
  radioGroup: _SbbRadioGroupBase<_SbbRadioButtonBase>;

  /** Id for the inner input field. */
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Whether this radio is checked. */
  private _checked: boolean = false;

  /** Whether this radio is disabled. */
  private _disabled: boolean;

  /** Whether this radio is required. */
  private _required: boolean;

  /** Value assigned to this radio. */
  private _value: any = null;

  /** Unregister function for _radioDispatcher */
  private _removeUniqueSelectionListener: () => void = () => {};

  /** Previous value of the input's tabindex. */
  private _previousTabIndex: number | undefined;

  /** The native `<input type=radio>` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  private _injector = inject(Injector);

  constructor(
    radioGroup: TypeRef<_SbbRadioGroupBase<_SbbRadioButtonBase>>,
    private _elementRef: ElementRef,
    protected readonly _changeDetector: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    private _radioDispatcher: UniqueSelectionDispatcher,
    tabIndex?: string,
  ) {
    // Assertions. Ideally these should be stripped out by the compiler.
    // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
    this.radioGroup = radioGroup;

    if (tabIndex) {
      this.tabIndex = numberAttribute(tabIndex, 0);
    }
  }

  /** Focuses the radio button. */
  focus(options?: FocusOptions, origin?: FocusOrigin): void {
    if (origin) {
      this._focusMonitor.focusVia(this._inputElement, origin, options);
    } else {
      this._inputElement.nativeElement.focus(options);
    }
  }

  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   * @docs-private
   */
  _markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this._changeDetector.markForCheck();
  }

  ngOnInit(): void {
    if (this.radioGroup) {
      // If the radio is inside a radio group, determine if it should be checked
      this.checked = this.radioGroup.value === this._value;

      if (this.checked) {
        this.radioGroup.selected = this;
      }

      // Copy name from parent radio group
      this.name = this.radioGroup.name;
    }

    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id && name === this.name) {
        this.checked = false;
      }
    });
  }

  ngDoCheck(): void {
    this._updateTabIndex();
  }

  ngAfterViewInit() {
    this._updateTabIndex();
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (!focusOrigin && this.radioGroup) {
        this.radioGroup._touch();
      }
    });
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit(new SbbRadioChange(this, this._value));
  }

  /** @docs-private */
  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `radio-button` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }

  /**
   * Triggered when the radio button received a click or the input recognized any change.
   * Clicking on a label element, will trigger a change event on the associated input.
   * @docs-private
   */
  _onInputChange(event?: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event?.stopPropagation();

    const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
    this.checked = true;
    this._emitChangeEvent();

    if (this.radioGroup) {
      this.radioGroup._controlValueAccessorChangeFn(this.value);
      if (groupValueChanged) {
        this.radioGroup._emitChangeEvent();
      }
    }
  }

  /** Sets the disabled state and marks for check if a change occurred. */
  protected _setDisabled(value: boolean) {
    if (this._disabled !== value) {
      this._disabled = value;
      this._changeDetector.markForCheck();
    }
  }

  /** Gets the tabindex for the underlying input element. */
  private _updateTabIndex() {
    const group = this.radioGroup;
    let value: number;

    // Implement a roving tabindex if the button is inside a group. For most cases this isn't
    // necessary, because the browser handles the tab order for inputs inside a group automatically,
    // but we need an explicitly higher tabindex for the selected button in order for things like
    // the focus trap to pick it up correctly.
    if (!group || !group.selected || this.disabled) {
      value = this.tabIndex;
    } else {
      value = group.selected === this ? this.tabIndex : -1;
    }

    if (value !== this._previousTabIndex) {
      // We have to set the tabindex directly on the DOM node, because it depends on
      // the selected state which is prone to "changed after checked errors".
      const input: HTMLInputElement | undefined = this._inputElement?.nativeElement;

      if (input) {
        input.setAttribute('tabindex', value + '');
        this._previousTabIndex = value;
        // Wait for any pending tabindex changes to be applied
        afterNextRender(
          () => {
            queueMicrotask(() => {
              // The radio group uses a "selection follows focus" pattern for tab management, so if this
              // radio button is currently focused and another radio button in the group becomes
              // selected, we should move focus to the newly selected radio button to maintain
              // consistency between the focused and selected states.
              if (
                group &&
                group.selected &&
                group.selected !== this &&
                document.activeElement === input
              ) {
                group.selected?._inputElement.nativeElement.focus();
                // If this radio button still has focus, the selected one must be disabled. In this
                // case the radio group as a whole should lose focus.
                if (document.activeElement === input) {
                  this._inputElement.nativeElement.blur();
                }
              }
            });
          },
          { injector: this._injector },
        );
      }
    }
  }
}

@Component({
  selector: 'sbb-radio-button',
  templateUrl: './radio-button.html',
  inputs: ['tabIndex'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'sbbRadioButton',
  host: {
    class: 'sbb-radio-button sbb-selection-item',
    '[class.sbb-selection-checked]': 'checked',
    '[class.sbb-selection-disabled]': 'disabled',
    // Needs to be removed since it causes some a11y issues (see angular/components#21266).
    '[attr.tabindex]': 'null',
    '[attr.id]': 'id',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
    // Note: under normal conditions focus shouldn't land on this element, however it may be
    // programmatically set, for example inside of a focus trap, in this case we want to forward
    // the focus to the native element.
    '(focus)': '_inputElement.nativeElement.focus()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SBB_RADIO_BUTTON, useExisting: SbbRadioButton }],
})
export class SbbRadioButton extends _SbbRadioButtonBase {
  constructor(
    @Optional() @Inject(SBB_RADIO_GROUP) radioGroup: SbbRadioGroup,
    elementRef: ElementRef,
    changeDetector: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    radioDispatcher: UniqueSelectionDispatcher,
    @Attribute('tabindex') tabIndex?: string,
  ) {
    super(radioGroup, elementRef, changeDetector, focusMonitor, radioDispatcher, tabIndex);
  }
}
