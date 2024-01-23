import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Autocomplete Forms
 * @order 20
 */
@Component({
  selector: 'sbb-autocomplete-forms-example',
  templateUrl: 'autocomplete-forms-example.html',
  standalone: true,
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    SbbOptionModule,
    JsonPipe,
  ],
})
export class AutocompleteFormsExample {
  value: string;

  filteredOptions = options.slice(0);

  valueChanged(newValue: string) {
    this.filteredOptions = options.filter(
      (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1,
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
];
