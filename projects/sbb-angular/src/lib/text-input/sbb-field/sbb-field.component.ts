import { Component, Input, OnInit, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbb-field',
  templateUrl: './sbb-field.component.html',
  styleUrls: ['./sbb-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbFieldComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SbbFieldComponent implements OnInit, ControlValueAccessor {

  @Input() label?: string;
  @Input() for?: string;

  constructor() { }

  ngOnInit() {
  }

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  writeValue(value: any): void {
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
}
