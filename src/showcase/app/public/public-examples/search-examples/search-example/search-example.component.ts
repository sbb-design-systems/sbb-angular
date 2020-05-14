import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sbb-search-example',
  templateUrl: './search-example.component.html',
  styleUrls: ['./search-example.component.css'],
})
export class SearchExampleComponent implements OnInit {
  myControl = new FormControl('');
  myControlStatic = new FormControl('');
  myControl2 = new FormControl('');

  options$: Subject<string[]>;

  options: string[] = [
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
  filter: '';
  filteredOptions = this.options.slice(0);
  searchCounterAmount = 0;
  showSpinner = false;

  searchSubject = new Subject<string>();
  searchResults: Array<any> = [];

  topics: string[] = [
    'Zurich',
    'Bern',
    'Basel',
    'Lausanne',
    'Lucerne',
    'St. Gallen',
    'Lugano',
    'Thun',
  ];

  filteredOptions2 = this.topics.slice(0);
  staticOptions: string[] = ['static option one', 'static option two'];

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.myControl.valueChanges.subscribe((newValue) => {
      this.filteredOptions = this.options.filter(
        (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
      );
    });

    this.myControl2.valueChanges.subscribe((newValue) => {
      this.filteredOptions2 = this.topics.filter(
        (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
      );
    });

    this.options$ = new Subject<string[]>();

    this.myControlStatic.valueChanges
      .pipe(debounceTime(500))
      .pipe(distinctUntilChanged())
      .subscribe((newValue) => {
        if (newValue.length >= 2) {
          this.options$.next(
            this.options.filter(
              (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
            )
          );
        } else {
          this.options$.next([]);
        }
      });

    this.searchSubject.pipe(distinctUntilChanged()).subscribe((searchTerm) => {
      this.showSpinner = true;
      this._http
        .get<any>(
          'https://data.sbb.ch/api/records/1.0/search/' +
            `?dataset=historische-bahnhofbilder&facet=ort&facet=datum_foto_1&q=${searchTerm
              .trim()
              .toLowerCase()}`
        )
        .subscribe((results) => {
          const searchResults = results;
          console.log(searchResults);
          this.searchResults = searchResults.records.map((record: any) => {
            return {
              id: record.fields.filename.id,
              station: record.fields.bahnhof,
            };
          });
          this.showSpinner = false;
        });
    });
  }

  search() {
    this.searchSubject.next(this.myControl2.value);
  }

  searchCounter() {
    this.searchCounterAmount++;
  }
}
