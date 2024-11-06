import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbSearchModule } from '@sbb-esta/angular/search';

/**
 * @title Search Autocomplete
 * @order 20
 */
@Component({
  selector: 'sbb-search-autocomplete-example',
  templateUrl: 'search-autocomplete-example.html',
  imports: [
    SbbSearchModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    SbbOptionModule,
    JsonPipe,
  ],
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
