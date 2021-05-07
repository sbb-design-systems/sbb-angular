import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Search Simple Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-search-simple-reactive-forms-example',
  templateUrl: './search-simple-reactive-forms-example.html',
})
export class SearchSimpleReactiveFormsExample {
  searchControl = new FormControl('');
  searchValues: string[] = [];

  handleSearch(value: string) {
    // Only display up to the last five search values.
    // This is only for the purpose of this example.
    this.searchValues = [value, ...this.searchValues].slice(0, 5);
  }
}
