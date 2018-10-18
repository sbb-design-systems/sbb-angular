import {
  Component,
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
export class CheckboxComponent implements ControlValueAccessor {

  @Input() inputId: string;
  @Input() name: string;
  @Input() formControlName: string;
  @Input() inputValue: any;
  @Input() required: boolean;
  @HostBinding('class.sbb-checkbox-checked') _checked = false;
  @HostBinding('class.sbb-checkbox-disabled') @Input() disabled: boolean;

  @Input()
  set checked(value: any) {
    this._checked = value;

    // I don't like Renderer2 :( See here: https://github.com/angular/angular/issues/14988
    this.renderer.setProperty(this.inputRadio.nativeElement, 'checked', this._checked);
    this.renderer.setProperty(this.inputRadio.nativeElement, 'aria-checked', this._checked);
  }

  @ViewChild('inputCheck') inputRadio: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {}

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.checked = value;
  }

  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  click($event) {
    const value = $event.target.checked;
    this.onChange(value);
    this.onTouched();
    this.writeValue(value);
  }

  setDisabledState?(disabled: boolean): void {
    this.disabled = disabled;
  }

}
