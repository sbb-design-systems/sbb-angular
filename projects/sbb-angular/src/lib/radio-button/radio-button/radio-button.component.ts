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

@Component({
  selector: 'sbb-radio-button[inputValue]',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonComponent),
    multi: true,
  } ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() inputId: string;
  @Input() name: string;
  @Input() formControlName: string;
  @Input() inputValue: any;
  @Input() required: boolean;
  @HostBinding('class.sbb-radio-checked') _checked = false;
  @HostBinding('class.sbb-radio-disabled') @Input() disabled: boolean;

  @Input()
  set checked(value: boolean) {
    this._checked = value;

    if(this._checked) {
      this.registry.select(this);
    }

    this.changeDetector.markForCheck();
  }

  get checked(): boolean {
    return this._checked;
  }

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  constructor(private changeDetector: ChangeDetectorRef, private registry: RadioButtonRegistryService) {}

  ngOnInit(): void {
    this.checkName();
    this.registry.add(this);
  }

  ngOnDestroy(): void {
    this.registry.remove(this);
  }

  writeValue(value: any): void {
    this.checked = this.inputValue === value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  click($event) {
    const value = $event.target.value;
    this.onChange(value);
    this.onTouched(value);
    this.writeValue(value);
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  uncheck(value: string) {
    this.writeValue(value);
  }

  private checkName(): void {
    if (this.name && this.formControlName && this.name !== this.formControlName) {
      this.throwNameError();
    }
    if (!this.name && this.formControlName) { this.name = this.formControlName; }
  }

  private throwNameError(): void {
    throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <sbb-radio-button formControlName="food" name="food"></sbb-radio-button>
    `);
  }

}
