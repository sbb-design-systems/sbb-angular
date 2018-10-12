import { Component, Input, ChangeDetectionStrategy, forwardRef, ViewChild, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class RadioButtonComponent implements ControlValueAccessor {

  @Input() inputId: string;
  @Input() name: string;
  @Input() inputValue: any;
  @Input() required: boolean;
  @HostBinding('class.sbb-radio-checked') @Input() checked: boolean;
  @HostBinding('class.sbb-radio-disabled') @Input() disabled: boolean;

  _value: string;

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  writeValue(value: any): void {
    console.log(value);
    if(!this.checked) {
      this.checked = this.inputValue === value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  click($event) {
    this.onChange(this.inputValue);
    this.onTouched(this.inputValue);
    this.writeValue(this.inputValue);
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
