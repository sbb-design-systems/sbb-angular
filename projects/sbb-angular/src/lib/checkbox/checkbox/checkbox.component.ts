import {
  Component,
  OnInit,
  forwardRef,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ElementRef,
  ViewChild,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sbb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [ {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  } ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {

  @Input() inputId: string;
  @Input() name: string;
  @Input() formControlName: string;
  @Input() inputValue: any;
  @Input() required: boolean;
  @HostBinding('class.sbb-checkbox-checked') _checked = false;
  @HostBinding('class.sbb-checkbox-disabled') @Input() disabled: boolean;

  @Input()
  set checked(value: boolean) {
    this._checked = value;

    // I don't like Renderer2 :( See here: https://github.com/angular/angular/issues/14988
    this.renderer.setProperty(this.inputRadio.nativeElement, 'checked', this._checked);
    this.renderer.setProperty(this.inputRadio.nativeElement, 'aria-checked', this._checked);
  }

  @ViewChild('inputCheck') inputRadio: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {}

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  ngOnInit(): void {
    this.checkName();
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

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
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
      must match. Ex: <sbb-checkbox formControlName="food" name="food"></sbb-checkbox>
    `);
  }

}
