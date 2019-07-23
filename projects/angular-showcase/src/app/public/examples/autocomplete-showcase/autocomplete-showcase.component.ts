import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'sbb-autocomplete-showcase',
  templateUrl: './autocomplete-showcase.component.html',
  styleUrls: ['./autocomplete-showcase.component.scss']
})
export class AutocompleteShowcaseComponent implements OnInit {
  myControl = new FormControl('');
  myControlStatic = new FormControl('');

  options$: Subject<string[]>;
  searchNumbers: Subject<string>;

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
  filter: '';
  filteredOptions = this.options.slice(0);
  staticOptions: string[] = ['statische Option eins', 'statische Option zwei'];

  ngOnInit() {
    this.myControl.valueChanges.subscribe(newValue => {
      this.filteredOptions = this.options.filter(
        option => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1
      );
    });

    this.options$ = new Subject<string[]>();

    this.myControlStatic.valueChanges
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .subscribe(newValue => {
        if (newValue.length >= 2) {
          this.options$.next(
            this.options.filter(
              option => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1
            )
          );
        } else {
          this.options$.next([]);
        }
      });
  }
}
