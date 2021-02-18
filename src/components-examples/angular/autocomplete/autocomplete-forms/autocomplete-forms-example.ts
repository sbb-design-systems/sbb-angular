import { Component } from '@angular/core';

/**
 * @title Autocomplete Forms
 * @order 20
 */
@Component({
  selector: 'sbb-autocomplete-forms-example',
  templateUrl: './autocomplete-forms-example.html',
})
export class AutocompleteFormsExample {
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
