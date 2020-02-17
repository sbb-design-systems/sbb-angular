import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Injector,
  Input,
  OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  AutocompleteComponent,
  AutocompleteOriginDirective
} from '@sbb-esta/angular-business/autocomplete';
import { Subject } from 'rxjs';

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
export class ChipInputComponent implements ControlValueAccessor, OnInit {
  @Input()
  options: string[] = [];

  @Input('sbbAutocomplete')
  autocomplete: AutocompleteComponent;

  @Input()
  @HostBinding('class.sbb-chip-input-disabled')
  get disabled() {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
  }

  @HostBinding('class.sbb-chip-input-active')
  get isActive() {
    return !this.disabled && this.focus;
  }

  inputModel = '';
  selectedOptions: string[] = [];
  focus = false;
  origin = new AutocompleteOriginDirective(this._elementRef);

  private _disabled = false;
  private _onTouchedCallback: () => void;
  private _onChangeCallback: (_: any) => void;

  readonly stateChanges = new Subject<void>();

  constructor(
    private _injector: Injector,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.autocomplete) {
      this.autocomplete.optionSelected.subscribe(event => this.selectOption(event.option.value));
    }
  }

  writeValue(obj: string[]): void {
    if (obj) {
      this.selectedOptions = obj;
    } else {
      this.selectedOptions = [];
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  selectOption(option: string) {
    if (!this.selectedOptions) {
      this.selectedOptions = [];
    }
    if (!this.selectedOptions.includes(option)) {
      this.writeValue(this.selectedOptions.concat([option]));
      this._onChangeCallback(this.selectedOptions);
      this._onTouchedCallback();
    }
    this.inputModel = null;
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
