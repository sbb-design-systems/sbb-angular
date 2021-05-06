import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * @title Search Historic Railway Pictures
 * @order 60
 */
@Component({
  selector: 'sbb-search-historic-railway-pictures-example',
  templateUrl: './search-historic-railway-pictures-example.html',
  styleUrls: ['./search-historic-railway-pictures-example.css'],
})
export class SearchHistoricRailwayPicturesExample implements OnInit {
  searchControl = new FormControl('');
  showSpinner = false;
  searchSubject = new Subject<string>();
  searchResults: Array<any> = [];

  cities: string[] = [
    'Zurich',
    'Bern',
    'Basel',
    'Lausanne',
    'Luzern',
    'St. Gallen',
    'Lugano',
    'Thun',
  ];
  filteredCities = this.cities.slice(0);

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.searchControl.valueChanges.subscribe((newValue) => {
      this.filteredCities = this.cities.filter(
        (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
      );
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
    this.searchSubject.next(this.searchControl.value);
  }
}
