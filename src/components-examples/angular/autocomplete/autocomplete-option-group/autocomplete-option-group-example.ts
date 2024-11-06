import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

/**
 * @title Autocomplete Option Group
 * @order 40
 */
@Component({
  selector: 'sbb-autocomplete-option-group-example',
  templateUrl: 'autocomplete-option-group-example.html',
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    SbbOptionModule,
    AsyncPipe,
    JsonPipe,
  ],
})
export class AutocompleteOptionGroupExample implements OnInit {
  myControlStatic = new FormControl('one');

  options: Observable<string[]>;

  staticOptions: string[] = ['static option one', 'static option two'];

  ngOnInit() {
    this.options = this.myControlStatic.valueChanges.pipe(
      startWith(this.myControlStatic.value),
      debounceTime(500),
      distinctUntilChanged(),
      map((newValue) =>
        !newValue || newValue.length < 2
          ? []
          : options.filter(
              (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1,
            ),
      ),
    );
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
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty ',
  'twenty one',
  'twenty two',
  'twenty three',
  'twenty four',
  'twenty five',
  'twenty six',
  'twenty seven',
  'twenty eight',
  'twenty nine',
  'thirty ',
  'thirty one',
  'thirty two',
  'thirty three',
  'thirty four',
  'thirty five',
  'thirty six',
  'thirty seven',
  'thirty eight',
  'thirty nine',
  'forty ',
  'forty one',
  'forty two',
  'forty three',
  'forty four',
  'forty five',
  'forty six',
  'forty seven',
  'forty eight',
  'forty nine',
];
