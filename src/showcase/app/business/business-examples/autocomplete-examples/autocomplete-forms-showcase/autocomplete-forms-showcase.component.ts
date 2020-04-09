import { Component } from '@angular/core';

@Component({
  selector: 'sbb-autocomplete-forms-showcase',
  templateUrl: './autocomplete-forms-showcase.component.html'
})
export class AutocompleteFormsShowcaseComponent {
  value: string;

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
    'Zehn'
  ];
  filteredOptions = this.options.slice(0);

  valueChanged(newValue: string) {
    this.filteredOptions = this.options.filter(
      option => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1
    );
  }
}
