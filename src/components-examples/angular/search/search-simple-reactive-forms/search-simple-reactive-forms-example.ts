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
    this.searchValues = [value, ...this.searchValues].slice(0, 5);
  }
}
