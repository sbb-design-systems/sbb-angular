import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sbb-search-custom-icon-autocomplete-static-options-example',
  templateUrl: './search-custom-icon-autocomplete-static-options-example.component.html',
})
export class SearchCustomIconAutocompleteStaticOptionsExample implements OnInit {
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
  staticOptions: string[] = ['static option one', 'static option two'];
  options$: Subject<string[]>;

  ngOnInit() {
    this.options$ = new Subject<string[]>();

    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .subscribe((newValue) => {
        if (newValue.length >= 2) {
          this.options$.next(
            this.options.filter(
              (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
            )
          );
        } else {
          this.options$.next([]);
        }
      });
  }
}
