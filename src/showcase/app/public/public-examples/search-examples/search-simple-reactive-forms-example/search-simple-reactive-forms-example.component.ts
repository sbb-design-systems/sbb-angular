import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-search-simple-reactive-forms-example',
  templateUrl: './search-simple-reactive-forms-example.component.html',
})
export class SearchSimpleReactiveFormsExample {
  searchControl = new FormControl('');
}
