import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let counter = 0;

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

  @Input() inputId = `sbb-checkbox-${counter++}`;
  @Input() value: any;
  @Input() required: boolean;
  @HostBinding('class.sbb-checkbox-checked') _checked = false;
  @HostBinding('class.sbb-checkbox-disabled') @Input() disabled: boolean;

  @Input()
  set checked(value: any) {
    this._checked = value;

    this.changeDetector.markForCheck();
  }

  get checked(): any {
    return this._checked;
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

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

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

}
