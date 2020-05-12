import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sbb-autocomplete-option-group-example',
  templateUrl: './autocomplete-option-group-example.component.html',
})
export class AutocompleteOptionGroupExampleComponent implements OnInit {
  myControlStatic = new FormControl('');

  options$ = new Subject<string[]>();

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
  staticOptions: string[] = ['statische Option eins', 'statische Option zwei'];

  ngOnInit() {
    this.myControlStatic.valueChanges
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .subscribe((newValue) => {
        if (newValue.length >= 2) {
          this.options$.next(
            this.options.filter(
              (option) => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1
            )
          );
        } else {
          this.options$.next([]);
        }
      });
  }
}
