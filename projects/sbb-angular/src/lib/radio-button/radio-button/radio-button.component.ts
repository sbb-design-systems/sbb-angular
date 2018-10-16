import { Component, Input, ChangeDetectionStrategy, forwardRef, HostBinding, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';

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
  @Input() inputTabindex = -1;
  @HostBinding('class.sbb-radio-checked') _checked = false;
  @HostBinding('class.sbb-radio-disabled') @Input() disabled: boolean;

  @ViewChild('inputRadio') inputRadio: ElementRef<HTMLElement>;

  @Input()
  set checked(value: boolean) {
    this._checked = value;
    this.renderer.setProperty(this.inputRadio.nativeElement, 'checked', this.checked);
    this.renderer.setProperty(this.inputRadio.nativeElement, 'aria-checked', this.checked);
  }

  get checked(): boolean {
    return this._checked || !!this.hostElement.nativeElement.querySelector('input:checked');
  }

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

  writeValue(value: any): void {
    this.checked = this.inputValue === value;
    console.log(this.inputId, this.name, this.inputValue, value);
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
    this.checked = this.inputValue === value;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
