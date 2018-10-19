import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'sbb-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements ControlValueAccessor {

  filter: string;
  value: any;
  disabled: boolean;

  @Input()
  staticOptions?: Array<any>;

  @Input()
  options?: Array<any> = [];

  @Output()
  inputedText: EventEmitter<string> = new EventEmitter<string>();

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
    this.inputedText.emit(this.filter);
  }
}
