import { Component, Input, OnInit, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbb-label',
  templateUrl: './sbb-label.component.html',
  styleUrls: ['./sbb-label.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbLabelComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SbbLabelComponent implements OnInit, ControlValueAccessor {

  @Input() label: string;
  @Input() for?: string;
  @Input() optional?: string;
  @Input() toolTip?:string;

  constructor() { }

  ngOnInit() {
    if(this.optional) {
       this.optional = '"' + this.optional + '"';
    }
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
