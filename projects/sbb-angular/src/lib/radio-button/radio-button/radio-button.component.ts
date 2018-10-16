import {
  Component,
  Input,
  ChangeDetectionStrategy,
  forwardRef,
  HostBinding,
  ViewChild,
  ElementRef,
  Renderer2,
  Injectable,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Injectable()
export class RadioControlRegistry {
  private _accessors = {};

  add(accessor: RadioButtonComponent) {
    if(!this._accessors[accessor.name]) {
      this._accessors[accessor.name] = [];
    }
    this._accessors[accessor.name].push(accessor);
  }

  remove(accessor: RadioButtonComponent) {
    if(this._accessors[accessor.name]) {
      this._accessors[accessor.name] = this._accessors[accessor.name].filter((obj) => {
        return obj.inputId !== accessor.inputId;
    });
    }
  }

  select(accessor: RadioButtonComponent) {
    this._accessors[accessor.name].forEach((c) => {
      if (c !== accessor) {
        c.uncheck(accessor.inputValue);
      }
    });
  }
}

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
export class RadioButtonComponent implements ControlValueAccessor, OnInit, OnDestroy {

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
    this.renderer.setProperty(this.inputRadio.nativeElement, 'checked', this._checked);
    this.renderer.setProperty(this.inputRadio.nativeElement, 'aria-checked', this._checked);
    if(this._checked) {
      this.registry.select(this);
    }
  }

  onChange = (obj: any) => { };
  onTouched = (_: any) => { };

  constructor(private renderer: Renderer2, private registry: RadioControlRegistry) {}

  ngOnInit(): void {
    this.registry.add(this);
  }

  ngOnDestroy(): void {
    this.registry.remove(this);
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

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  uncheck(value: string) {
    this.writeValue(value);
  }

}
