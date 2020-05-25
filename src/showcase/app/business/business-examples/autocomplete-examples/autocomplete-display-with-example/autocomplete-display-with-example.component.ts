import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

interface ExampleOption {
  label: string;
  value: number;
}

@Component({
  selector: 'sbb-autocomplete-display-with-example',
  templateUrl: './autocomplete-display-with-example.component.html',
})
export class AutocompleteDisplayWithExampleComponent implements OnInit {
  myControl = new FormControl('');

  filteredOptions = options.slice(0);

  formatOption = (value: ExampleOption) => value.label;

  ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filteredOptions = options.filter(
        (option) =>
          option.label.toLocaleUpperCase().indexOf(newValue.label.toLocaleUpperCase()) > -1
      );
    });
  }
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
