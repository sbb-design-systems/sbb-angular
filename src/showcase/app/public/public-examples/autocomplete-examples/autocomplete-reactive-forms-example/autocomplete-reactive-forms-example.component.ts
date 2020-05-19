import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-autocomplete-reactive-forms-example',
  templateUrl: './autocomplete-reactive-forms-example.component.html',
})
export class AutocompleteReactiveFormsExampleComponent implements OnInit {
  myControl = new FormControl('');

  filteredOptions = options.slice(0);

  ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filteredOptions = options.filter(
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
