import {
  ChangeDetectorRef,
  HostBinding,
  Input
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

let counter = 0;

export abstract class BaseCheckbox implements ControlValueAccessor {
  /** @docs-private */
  @HostBinding('class.sbb-checkbox') checkboxClass = true;
  /**
   * Identifier of a checkbox field
   */
  @Input() inputId = `sbb-checkbox-${counter++}`;
  /**
   * Value contained in a checkbox field
   */
  @Input() value: any;
  /**
   * Used to set the 'aria-label' attribute on the underlying input element.
   */
    // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel: string;
  /**
   * The 'aria-labelledby' attribute takes precedence as the element's text alternative.
   */
    // tslint:disable-next-line:no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string;
  /**
   * The 'aria-describedby' attribute is read after the element's label and field type.
   */
    // tslint:disable-next-line:no-input-rename
  @Input('aria-describedby') ariaDescribedby: string;
  /**
   * Establish if a checkbox value is required or not
   */
  @Input() required: boolean;
  /**
   * Sets checkbox field disabled
   */
  @Input() disabled: boolean;
  /**
   * The checked state of the checkbox
   */
  @Input()
  get checked(): any {
    return this._checked;
  }
  set checked(value: any) {
    this._checked = value;
    this._changeDetector.markForCheck();
  }
  private _checked = false;

  /** @docs-private */
  get ariaChecked(): String {
    return this.checked;
  }

  /**
   * Property that describes the status change of a checkbox field
   */
  onChange = (_: any) => {};
  /**
   * Property that describes an updating of checkbox
   */
  onTouched = () => {};

  constructor(protected readonly _changeDetector: ChangeDetectorRef) {}

  /**
   * Sets the value in input in the checkbox field
   */
  writeValue(value: any): void {
    this.checked = value;
  }

  /**
   * Method that records the change on a checkbox field
   */
  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  /**
   * Method that records the touch on a checkbox field
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  /**
   * Method that set up a checkbox field to the click
   */
  click() {
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.writeValue(this.checked);
    console.log('in click');
  }

  /**
   * Method that sets disabled a checkbox
   */
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this._changeDetector.markForCheck();
  }
}
