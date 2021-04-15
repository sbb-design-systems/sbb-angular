import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Search Header Mode With Autocomplete
 * @order 30
 */
@Component({
  selector: 'sbb-search-header-autocomplete-example',
  templateUrl: './search-header-autocomplete-example.html',
})
export class SearchHeaderAutocompleteExample {
  searchValues: string[] = [];
  searchControl = new FormControl('');

  filteredOptions = options.slice(0);

  handleSearch(value: string) {
    this.searchValues = [value, ...this.searchValues].slice(0, 5);
  }
}

const options: string[] = [
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
