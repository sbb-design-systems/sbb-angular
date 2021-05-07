import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Search Header Mode With Autocomplete
 * @order 50
 */
@Component({
  selector: 'sbb-search-header-autocomplete-example',
  templateUrl: './search-header-autocomplete-example.html',
})
export class SearchHeaderAutocompleteExample {
  searchValues: string[] = [];
  searchControl = new FormControl('');
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
