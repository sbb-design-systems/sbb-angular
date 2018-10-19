import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { AutocompleteOptionListComponent } from '../autocomplete-option-list/autocomplete-option-list.component';

@Component({
  selector: 'sbb-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {

  filter: string;
  value: any;
  disabled: boolean;

  @ViewChild('sbb-autocomplete-options-list')
  optionsList: AutocompleteOptionListComponent;

  @Input()
  minDigitsTrigger = 3;

  @Input()
  staticOptions?: Array<any>;

  @Input()
  options?: Array<any> = [];

  @Output()
  inputedText: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
  }


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

  onInput($event) {
    this.filter = $event.target.value;
    if (this.filter.length >= this.minDigitsTrigger) {
      this.inputedText.emit(this.filter);
      this.optionsList._isOpen = true;
      this.optionsList._setVisibility();
    }
  }

  onBlur($event) {
    this.optionsList._isOpen = false;
    this.optionsList._setVisibility();
  }

}
