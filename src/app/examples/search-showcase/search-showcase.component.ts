import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sbb-search-showcase',
  templateUrl: './search-showcase.component.html',
  styleUrls: ['./search-showcase.component.scss']
})
export class SearchShowcaseComponent implements OnInit {

  myControl = new FormControl('');
  myControlStatic = new FormControl('');
  myControl2 = new FormControl('');

  options$: Subject<string[]>;
  searchNumbers: Subject<string>;
  mode: 'header' | 'default' = 'default';

  options: string[] = ['Eins', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben', 'Acht', 'Neun', 'Zehn'];
  filter: '';
  filteredOptions = this.options.slice(0);
  filteredOptions2 = this.options.slice(0);

  staticOptions: string[] = ['statische Option eins', 'statische Option zwei']; ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filteredOptions = this.options.filter((option) => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1);
    });

    this.myControl2.valueChanges.subscribe((newValue) => {
      this.filteredOptions2 = this.options.filter((option) => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1);
    });

    this.options$ = new Subject<string[]>();


    this.myControlStatic.valueChanges
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .subscribe((newValue) => {
        if (newValue.length >= 2) {
          this.options$
            .next(this.options.filter((option) => option.toLocaleLowerCase().indexOf(newValue.toLocaleLowerCase()) > -1));
        } else {
          this.options$.next([]);
        }
      });

  }


  toggleMode() {
    if (this.mode === 'default') {
      this.mode = 'header';
    } else {
      this.mode = 'default';
    }
  }
}
