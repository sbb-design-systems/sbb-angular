import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * @title Require an autocomplete option to be selected
 * @order 70
 */
@Component({
  selector: 'sbb-autocomplete-require-selection-example',
  templateUrl: 'autocomplete-require-selection-example.html',
  standalone: true,
  imports: [
    FormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    JsonPipe,
  ],
})
export class AutocompleteRequireSelectionExample implements OnInit {
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
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }
}
