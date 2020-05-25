import { Component } from '@angular/core';

@Component({
  selector: 'sbb-autocomplete-forms-example',
  templateUrl: './autocomplete-forms-example.component.html',
})
export class AutocompleteFormsExampleComponent {
  value: string;

  filteredOptions = options.slice(0);

  valueChanged(newValue: string) {
    this.filteredOptions = options.filter(
      (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
    );
  }
}

const options: string[] = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];
