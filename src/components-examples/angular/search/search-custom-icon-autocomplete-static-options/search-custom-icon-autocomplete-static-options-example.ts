import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/**
 * @title Custom Icon And Autocomplete With Static Options
 * @order 30
 */
@Component({
  selector: 'sbb-search-custom-icon-autocomplete-static-options-example',
  templateUrl: './search-custom-icon-autocomplete-static-options-example.html',
})
export class SearchCustomIconAutocompleteStaticOptionsExample implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  staticOptions: string[] = ['static option one', 'static option two'];
  options = new Subject<string[]>();

  private _destroyed = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this._destroyed))
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

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
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
