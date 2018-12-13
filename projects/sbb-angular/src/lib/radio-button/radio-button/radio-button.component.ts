import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { RadioButtonRegistryService } from './radio-button-registry.service';
import { RadioButton } from './radio-button.model';

let counter = 0;

@Component({
  selector: 'sbb-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent extends RadioButton implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * Radio button identifier
   */
  @Input() inputId = `sbb-radio-button-${counter++}`;
  /**
   * Indicates radio button name in formControl
   */
  @Input() formControlName: string;
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
   * Indicates that the radio button field is required
   */
  @Input() required: boolean;
  /**
   * The disabled state of the radio button
   */
  @Input() disabled: boolean;
  /**
   * The checked state of the radio button
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = value;

    if (this._checked) {
      this.registry.select(this);
    }

    this.changeDetector.markForCheck();
  }
  private _checked = false;
  /**
   * Class property that represents a change on the radio button
   */
  onChange = (_: any) => { };
  /**
   * Class property that represents a touch on the radio button
   */
  onTouched = () => { };

  constructor(private changeDetector: ChangeDetectorRef, private registry: RadioButtonRegistryService) {
    super();
  }

  ngOnInit(): void {
    this.checkName();
    this.registry.add(this);
  }

  ngOnDestroy(): void {
    this.registry.remove(this);
  }
  writeValue(value: any): void {
    this.checked = this.value === value;
  }

  /**
   * Registers the on change callback
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  /**
   * Registers the on touched callback
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Manage the event click on the radio button
   */
  click($event: Event) {
    this.onChange(this.value);
    this.onTouched();
    this.writeValue(this.value);
    this.checked = true;
  }

  /**
   * Sets the radio button status to disabled
   */
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  /**
   * Unchecks the radio button
   */
  uncheck() {
    this.checked = false;
  }

  /**
   * Verify that radio button name matches with radio button form control name
   */
  private checkName(): void {
    if (this.name && this.formControlName && this.name !== this.formControlName) {
      this.throwNameError();
    } else if (!this.name && this.formControlName) {
      this.name = this.formControlName;
    }
  }

  /**
   * Throws an exception if the radio button name doesn't match with the radio button form control name
   */
  private throwNameError(): void {
    throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <sbb-radio-button formControlName="food" name="food"></sbb-radio-button>
    `);
  }

}
