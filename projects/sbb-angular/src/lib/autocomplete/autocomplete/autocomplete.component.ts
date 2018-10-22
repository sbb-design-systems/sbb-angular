import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutocompleteOptionListComponent } from '../autocomplete-option-list/autocomplete-option-list.component';

@Component({
  selector: 'sbb-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteComponent implements ControlValueAccessor {

  filter: string;
  value: any;
  disabled: boolean;

  @ViewChild('optionsList')
  optionsList: AutocompleteOptionListComponent;

  @Input()
  minDigitsTrigger = 3;

  @Input()
  staticOptions?: Array<any>;

  @Input()
  options?: Array<any> = [];

  @Output()
  inputedText: EventEmitter<string> = new EventEmitter<string>();

  isFocused = false;
  get showOptions() { return this.isFocused && !!this.options.length; }

  propagateChange: any = () => { };

  writeValue(newValue: any): void {
    if (newValue) {
      this.value = newValue;
      this.propagateChange(newValue);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void { }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  setVisibility() {
    this.isFocused = (this.filter.length >= this.minDigitsTrigger) || (this.staticOptions && !!this.staticOptions.length) ;
  }

  onInput($event) {
    this.filter = $event.target.value;
    console.log('input', $event.target.value);
    this.setVisibility();
    this.inputedText.emit(this.filter);
  }

  onBlur($event) {
    this.isFocused = false;
  }

}
