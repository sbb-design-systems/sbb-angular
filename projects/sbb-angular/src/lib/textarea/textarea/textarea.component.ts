import { Component, forwardRef, ChangeDetectionStrategy, Input, ViewChild, ElementRef, NgZone, HostBinding, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take, first } from 'rxjs/operators';

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
  matTextareaAutosize = true;

  @Input()
  disabled: boolean;

  @Input()
  readonly: boolean;

  @Input()
  maxlength: number;

  @ViewChild('digitscounter')
  digitsCounter: ElementRef;

  @ViewChild('autosize')
  autosize: CdkTextareaAutosize;

  @HostBinding('class.disabled')
  disabledClass: boolean;

  constructor(private ngZone: NgZone) { }

  triggerResize() {
    this.ngZone.onStable.pipe(first())
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  propagateChange: any = () => { };

  writeValue(newValue: any) {
    if (newValue) {
      this.textContent = newValue;
      this.propagateChange(newValue);
      this.updateDigitsCounter(newValue);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void { }

  onChange(event) {
    this.propagateChange(event.target.value);
    this.updateDigitsCounter(event.target.value);
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.disabledClass = disabled;
  }

  updateDigitsCounter(newValue) {
    if (this.maxlength) {
      this.digitsCounter.nativeElement.innerText = `Remaining ${this.maxlength - newValue.length} digits`;
    } else {
      this.digitsCounter.nativeElement.innerText = '';
    }
  }
}
