import { Component, OnInit, Input, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbb-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioButtonComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonComponent implements OnInit, ControlValueAccessor {

  @Input() id: string;
  @Input() name: string;
  @Input() value: string;
  @Input() checked: boolean;


  ngOnInit(): void {
    console.log('ngOnInit: Method not implemented.');
  }

  writeValue(newValue: any): void {
    console.log('writeValue: Method not implemented.');
    if(newValue) {
      this.value = newValue;
    }
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange: Method not implemented.');
  }

  registerOnTouched(fn: any): void {
    console.log('registerOnTouched: Method not implemented.');
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log('setDisabledState: Method not implemented.');
  }

}
