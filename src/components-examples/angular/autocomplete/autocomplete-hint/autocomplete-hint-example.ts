import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * @title Autocomplete Hint
 * @order 30
 */
@Component({
  selector: 'sbb-autocomplete-hint-example',
  templateUrl: './autocomplete-hint-example.html',
})
export class AutocompleteHintExample implements OnInit {
  readonly maxOptionsListLength = 5;

  myControlHint = new FormControl('');

  filteredOptionsHint = options.slice(0);

  ngOnInit() {
    this.myControlHint.valueChanges.pipe(distinctUntilChanged()).subscribe((newValue) => {
      this.filteredOptionsHint = options.filter(
        (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
      );
    });
  }
}

const options: string[] = [
  'zero',
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
