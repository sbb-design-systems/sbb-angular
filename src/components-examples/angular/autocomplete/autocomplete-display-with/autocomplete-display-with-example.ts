import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface ExampleOption {
  label: string;
  value: number;
}

/**
 * @title Autocomplete Display With
 * @order 50
 */
@Component({
  selector: 'sbb-autocomplete-display-with-example',
  templateUrl: 'autocomplete-display-with-example.html',
})
export class AutocompleteDisplayWithExample {
  myControl = new FormControl<string | ExampleOption>('');

  filteredOptions: Observable<ExampleOption[]> = this.myControl.valueChanges.pipe(
    startWith(''),
    map((newValue: string | ExampleOption | null) =>
      options.filter(
        (option) =>
          option.label
            .toLocaleUpperCase()
            .indexOf(
              (typeof newValue === 'object' ? newValue!.label : newValue).toLocaleUpperCase()
            ) > -1
      )
    )
  );

  formatOption = (value: ExampleOption) => value.label;
}

const options: ExampleOption[] = [
  { label: 'zero', value: 0 },
  { label: 'one', value: 1 },
  { label: 'two', value: 2 },
  { label: 'three', value: 3 },
  { label: 'four', value: 4 },
  { label: 'five', value: 5 },
  { label: 'six', value: 6 },
  { label: 'seven', value: 7 },
  { label: 'eight', value: 8 },
  { label: 'nine', value: 9 },
  { label: 'ten', value: 10 },
];
