import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'sbb-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements ControlValueAccessor {

  @Input()
  textContent: string;

  // Object property on which filtering the options
  @Input()
  filterBy: string;

  @Input()
  value: any;

  @Input()
  staticOptions?: Array<any>;

  @Input()
  options: Array<any> = [{
    name: 'Davide',
    lastname: 'Aresta'
  }, {
    name: 'Dario',
    lastname: 'D\'Oronzo'
  },
  {
    name: 'Marco',
    lastname: 'Sut'
  }, {
    name: 'Stefan',
    lastname: 'Milei'
  }
  ];

  disabled: boolean;

  propagateChange: any = () => { };

  writeValue(newValue: any): void {
    if (newValue) {
      this.textContent = newValue;
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
   this.textContent = $event.target.value;
  }
}
