import { Component, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbb-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements ControlValueAccessor {

  textContent: string;
  disabled: boolean;

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  writeValue(textContent: any): void {
    this.textContent = textContent || '';
    this.onChange(textContent);
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
