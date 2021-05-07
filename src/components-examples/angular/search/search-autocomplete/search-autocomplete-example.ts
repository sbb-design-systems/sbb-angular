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
  options: string[] = [
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

  handleSearch(value: string) {
    // Only display up to the last five search values.
    // This is only for the purpose of this example.
    this.searchValues = [value, ...this.searchValues].slice(0, 5);
  }
}
