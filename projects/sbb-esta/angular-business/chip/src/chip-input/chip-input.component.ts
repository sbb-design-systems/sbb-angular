import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Injector,
  Input,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'sbb-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => ChipInputComponent)
    }
  ]
})
export class ChipInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input()
  options: string[] = [];

  inputModel = '';
  selectedOptions: string[] = [];
  disabled: boolean;
  focus = false;

  private _onTouchedCallback: () => void;
  private _onChangeCallback: (_: any) => void;
  private _control: FormControl;

  get isDisabled() {
    return !!this.disabled;
  }

  get isActive() {
    return !this.disabled && this.focus;
  }

  get isInvalid() {
    return this._control ? this._control.invalid : false;
  }

  constructor(
    private _injector: Injector,
    private _renderer: Renderer2,
    private _elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    const ngControl: NgControl = this._injector.get(NgControl, null);
    if (ngControl) {
      this._control = ngControl.control as FormControl;
    }
  }

  writeValue(obj: string[]): void {
    if (obj) {
      obj = obj.filter(value => {
        if (this.options && this.options.includes(value)) {
          return true;
        } else {
          console.warn(`Warning: Value '${value}' not provided in selectable options.`);
          return false;
        }
      });
      this.selectedOptions = obj;
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    this.disabled = isDisabled;
  }

  selectOption($event) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    if (!this.selectedOptions.includes($event.option.value)) {
      this.writeValue(this.selectedOptions.concat([$event.option.value]));
      this._onChangeCallback(this.selectedOptions);
      this._onTouchedCallback();
    }
    setTimeout(() => {
      this.inputModel = '';
    }, 1);
  }

  deselectOption(option: string) {
    const index = this.selectedOptions.findIndex(opt => opt === option);
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      if (this.selectedOptions.length === 0) {
        this.selectedOptions = null;
      }
      this._onChangeCallback(this.selectedOptions);
      this._onTouchedCallback();
    }
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }
}
