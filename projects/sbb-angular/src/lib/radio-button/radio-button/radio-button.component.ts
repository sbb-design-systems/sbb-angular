import {
  Component,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  HostBinding,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { RadioButtonRegistryService } from './radio-button-registry.service';
import { RadioButton } from './radio-button.model';

let counter = 0;

@Component({
  selector: 'sbb-radio-button[value]',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonComponent),
    multi: true,
  } ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent extends RadioButton implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * RadioButton identifier
   */
  @Input() inputId = `sbb-radio-button-${counter++}`;
  /**
   * Specific radioButton name in formControl
   */
  @Input() formControlName: string;
  /**
   * Specific that radioButton field is required
   */
  @Input() required: boolean;
  /**
   * Sets radioButton class property unchecked
   */
  @HostBinding('class.sbb-radio-checked') _checked = false;
  /**
   * Sets radioButton class property disabled
   */
  @HostBinding('class.sbb-radio-disabled') @Input() disabled: boolean;

  @Input()
  /**
   * Sets radioButton with the value in input
   */
  set checked(value: boolean) {
    this._checked = value;

    if(this._checked) {
      this.registry.select(this);
    }

    this.changeDetector.markForCheck();
  }
  /**
   * Returns a value that means if a radioButton is checked
   */
  get checked(): boolean {
    return this._checked;
  }
  /**
   * Class property that represents a change on radioButton field
   */
  onChange = (obj: any) => { };
  /**
   * Class property that represents a touch on radioButton field
   */
  onTouched = (_: any) => { };

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
   * Records a change on radioButton field
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  /**
   * Records a touch on radioButton field
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  /**
   * Manage the event click on radioButton field
   */
  click($event) {
    const value = $event.target.value;
    this.onChange(value);
    this.onTouched(value);
    this.writeValue(value);
  }
  /**
   * Sets radioButton status to disabled
   */
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
  /**
   * Sets radioButton field to unchecked
   */
  uncheck() {
    this.checked = false;
  }
  /**
   * Verify that radioButton name matches with radioButton form control name
   */
  private checkName(): void {
    if (this.name && this.formControlName && this.name !== this.formControlName) {
      this.throwNameError();
    }
    if (!this.name && this.formControlName) { this.name = this.formControlName; }
  }
  /**
   * Throws an exception if radioButton name doesn't match with radioButton form control name
   */
  private throwNameError(): void {
    throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <sbb-radio-button formControlName="food" name="food"></sbb-radio-button>
    `);
  }

}
