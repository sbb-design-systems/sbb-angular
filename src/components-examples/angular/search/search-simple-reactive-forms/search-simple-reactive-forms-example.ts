import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbSearchModule } from '@sbb-esta/angular/search';

/**
 * @title Search Simple Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-search-simple-reactive-forms-example',
  templateUrl: 'search-simple-reactive-forms-example.html',
  imports: [SbbSearchModule, SbbInputModule, FormsModule, ReactiveFormsModule, JsonPipe],
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
