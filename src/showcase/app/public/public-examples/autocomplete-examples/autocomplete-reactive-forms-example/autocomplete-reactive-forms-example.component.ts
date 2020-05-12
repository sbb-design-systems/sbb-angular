import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-autocomplete-reactive-forms-example',
  templateUrl: './autocomplete-reactive-forms-example.component.html',
})
export class AutocompleteReactiveFormsExampleComponent implements OnInit {
  myControl = new FormControl('');

  options: string[] = [
    'Eins',
    'Zwei',
    'Drei',
    'Vier',
    'Fünf',
    'Sechs',
    'Sieben',
    'Acht',
    'Neun',
    'Zehn',
  ];
  filteredOptions = this.options.slice(0);

  ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filteredOptions = this.options.filter(
        (option) => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1
      );
    });
  }
}
