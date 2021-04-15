import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Search Simple Header Mode
 * @order 40
 */
@Component({
  selector: 'sbb-search-simple-header-mode-example',
  templateUrl: './search-simple-header-mode-example.html',
})
export class SearchSimpleHeaderModeExample {
  searchValues: string[] = [];
  searchControl = new FormControl('');

  handleSearch(value: string) {
    this.searchValues = [value, ...this.searchValues].slice(0, 5);
  }
}
