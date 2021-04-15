import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Search Autocomplete
 * @order 20
 */
@Component({
  selector: 'sbb-search-autocomplete-example',
  templateUrl: './search-autocomplete-example.html',
})
export class SearchAutocompleteExample {
  searchControl = new FormControl('');
  searchValues: string[] = [];

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
