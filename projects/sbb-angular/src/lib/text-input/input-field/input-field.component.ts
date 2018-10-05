import { Component, Input, OnInit, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbb-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {

  @Input() inputType: string;
  @Input() placeholder: string;
  @Input() maxLength?: string;
  @Input() size?: string;
  @Input() pattern?: string;
  @Input() disabled?: boolean;

  value: string;

  isPasswordInputField: boolean;

  constructor() { }

  ngOnInit() {

    this.value = '';

    if(!this.maxLength) {
        this.maxLength = '25';
    }

    if(!this.size) {
        this.size = '25';
    }

    if(new RegExp('password', 'ig').test(this.inputType)) {
       this.isPasswordInputField = true;
    }

  }

  onFocusIn(event) {
    event.target.value = this.value;
  }

  onFocusOut(event) {
    this.value  = event.target.value;
    const value = event.target.value;
    const size  = event.target.size;
    if(event.target.value.length > event.target.size) {
       event.target.value = value.substring(0, size-3) + '...';
    }
  }

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  writeValue(value: any): void {
    this.value = value || '';
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  change($event) {
    this.onChange($event.target.value);
    this.onTouched($event.target.value);
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
