import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Attribute,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

let nextId = 0;

/** Change event object emitted by sbb angular checkboxes. */
export class SbbCheckboxChange<TCheckbox extends CheckboxBase = CheckboxBase> {
  constructor(
    /** The source checkbox of the event. */
    public source: TCheckbox,
    /** The new `checked` value of the checkbox. */
    public checked: boolean
  ) {}
}

@Directive()
export abstract class CheckboxBase implements ControlValueAccessor {
  /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
  @Input() @HostBinding() id: string;
  /**
   * Identifier of a checkbox field
   * @deprecated This will be replaced by an internal getter, based on the id property.
   */
  @Input() inputId: string;
  /** Value contained in a checkbox field */
  @Input() value: any;
  /** Used to set the 'aria-label' attribute on the underlying input element. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel: string;
  /** The 'aria-labelledby' attribute takes precedence as the element's text alternative. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string;
  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  // tslint:disable-next-line:no-input-rename
  @Input('aria-describedby') ariaDescribedby: string;
  /** The tabindex of the checkbox */
  tabIndex: number;
  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  private _required: boolean;
  /** Name value will be applied to the input element if present */
  @Input() name: string | null = null;
  /** Whether the checkbox is checked. */
  @Input()
  get checked(): any {
    return this._checked;
  }
  set checked(value: any) {
    if (value !== this.checked) {
      this._checked = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _checked = false;
  /**
   * Whether the checkbox is disabled.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this.disabled) {
      this._disabled = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _disabled = false;
  /** @docs-private */
  @HostBinding('class.sbb-checkbox') checkboxClass = true;
  /** @docs-private */
  @HostBinding('attr.tabindex') _tabIndex = null;
  /** Event emitted when the checkbox's `checked` value changes. */
  @Output() readonly change = new EventEmitter<SbbCheckboxChange<this>>();
  /** @docs-private */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;
  /**
   * Property that describes the status change of a checkbox field
   */
  private _onChange = (_: any) => {};
  /**
   * Property that describes an updating of checkbox
   */
  private _onTouched = () => {};

  constructor(
    protected readonly _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string,
    type = 'checkbox'
  ) {
    this.id = `sbb-${type}-${++nextId}`;
    this.inputId = `${this.id}-input`;
    this.tabIndex = parseInt(tabIndex, 10) || 0;
    this._focusMonitor.monitor(elementRef, true).subscribe(focusOrigin => {
      if (!focusOrigin) {
        // When a focused element becomes disabled, the browser *immediately* fires a blur event.
        // Angular does not expect events to be raised during change detection, so any state change
        // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
        // See https://github.com/angular/angular/issues/17793. To work around this, we defer
        // telling the form control it has been touched until the next tick.
        Promise.resolve().then(() => {
          this._onTouched();
          _changeDetectorRef.markForCheck();
        });
      }
    });
  }

  /**
   * Sets the value in input in the checkbox field
   */
  writeValue(value: any): void {
    this.checked = !!value;
  }

  /**
   * Method that records the change on a checkbox field
   */
  registerOnChange(fn: (_: any) => {}): void {
    this._onChange = fn;
  }

  /**
   * Method that records the touch on a checkbox field
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /**
   * Method that sets disabled a checkbox
   */
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /** Focuses the checkbox. */
  focus(): void {
    this._focusMonitor.focusVia(this._inputElement, 'keyboard');
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
  }

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   */
  _onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();

    if (!this.disabled) {
      this.toggle();

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
    }
  }

  _onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  protected _emitChangeEvent() {
    const event = new SbbCheckboxChange<this>(this, this.checked);
    this._onChange(this.checked);
    this.change.emit(event);
  }
}
