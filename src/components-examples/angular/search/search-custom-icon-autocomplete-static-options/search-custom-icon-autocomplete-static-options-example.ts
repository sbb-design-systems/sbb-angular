import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * @title Custom Icon And Autocomplete With Static Options
 * @order 30
 */
@Component({
  selector: 'sbb-search-custom-icon-autocomplete-static-options-example',
  templateUrl: './search-custom-icon-autocomplete-static-options-example.html',
})
export class SearchCustomIconAutocompleteStaticOptionsExample implements OnInit {
  searchControl = new FormControl('');

  staticOptions: string[] = ['static option one', 'static option two'];
  options = new Subject<string[]>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .subscribe((newValue) => {
        if (newValue.length >= 2) {
          this.options.next(
            options.filter(
              (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
            )
          );
        } else {
          this.options.next([]);
        }
      });
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
