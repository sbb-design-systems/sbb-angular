import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sbb-autocomplete-hint-showcase',
  templateUrl: './autocomplete-hint-showcase.component.html'
})
export class AutocompleteHintShowcaseComponent implements OnInit {
  readonly maxOptionsListLength = 5;

  myControlHint = new FormControl('');

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
  filteredOptionsHint = this.options.slice(0);

  ngOnInit() {
    this.myControlHint.valueChanges.pipe(distinctUntilChanged()).subscribe(newValue => {
      this.filteredOptionsHint = this.options.filter(
        option => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1
      );
    });
  }
}
