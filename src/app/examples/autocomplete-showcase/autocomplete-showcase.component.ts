import { Component,  OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sbb-autocomplete-showcase',
  templateUrl: './autocomplete-showcase.component.html',
  styleUrls: ['./autocomplete-showcase.component.scss']
})
export class AutocompleteShowcaseComponent implements OnInit {

  myControl = new FormControl('');
  options: string[] = ['Eins', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'];
  filter: '';
  filteredOptions = this.options.slice(0);
  minDigitsBeforePanelOpening = 1;

  ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filteredOptions = this.options.filter((option) => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1);
    });
  }
}
