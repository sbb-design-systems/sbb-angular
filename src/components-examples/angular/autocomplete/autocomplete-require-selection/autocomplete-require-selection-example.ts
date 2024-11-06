import { JsonPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Require an autocomplete option to be selected
 * @order 70
 */
@Component({
  selector: 'sbb-autocomplete-require-selection-example',
  templateUrl: 'autocomplete-require-selection-example.html',
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class AutocompleteRequireSelectionExample {
  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  myControl = new FormControl('');
  options: string[] = [
    'Zürich',
    'Bern',
    'St. Gallen',
    'Luzern',
    'Basel',
    'Genf',
    'Biel/Bienne',
    'Lausanne',
    'Winterthur',
  ];
  filteredOptions: string[];

  constructor() {
    this.filteredOptions = this.options.slice();
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter((o) => o.toLowerCase().includes(filterValue));
  }
}
