import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-search-autocomplete-example',
  templateUrl: './search-autocomplete-example.component.html',
})
export class SearchAutocompleteExample {
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
  filteredOptions = this.options.slice(0);
}
