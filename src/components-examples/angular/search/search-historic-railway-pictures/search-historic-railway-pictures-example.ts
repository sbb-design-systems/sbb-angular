import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

interface ImageResponse {
  records: Array<{ fields: { filename: { id: string }; bahnhof: string } }>;
}

interface ImageRecord {
  id: string;
  station: string;
}

/**
 * @title Search Historic Railway Pictures
 * @order 60
 */
@Component({
  selector: 'sbb-search-historic-railway-pictures-example',
  templateUrl: './search-historic-railway-pictures-example.html',
  styleUrls: ['./search-historic-railway-pictures-example.css'],
})
export class SearchHistoricRailwayPicturesExample implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  showSpinner = false;
  searchSubject = new Subject<string>();
  searchResults: ImageRecord[] = [];

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

  private _destroyed = new Subject<void>();

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        map((newValue) =>
          this.cities.filter(
            (option) => option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1
          )
        ),
        takeUntil(this._destroyed)
      )
      .subscribe((filteredCities) => (this.filteredCities = filteredCities));

    this.searchSubject
      .pipe(
        distinctUntilChanged(),
        tap(() => (this.showSpinner = true)),
        switchMap((searchTerm) =>
          this._http.get<ImageResponse>(
            'https://data.sbb.ch/api/records/1.0/search/' +
              `?dataset=historische-bahnhofbilder&facet=ort&facet=datum_foto_1&q=${searchTerm
                .trim()
                .toLowerCase()}`
          )
        ),
        map((result) =>
          result.records.map(
            (record) =>
              ({
                id: record.fields.filename.id,
                station: record.fields.bahnhof,
              } as ImageRecord)
          )
        ),
        takeUntil(this._destroyed)
      )
      .subscribe(
        (searchResults) => {
          this.showSpinner = false;
          this.searchResults = searchResults;
        },
        () => (this.showSpinner = false)
      );
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  search() {
    this.searchSubject.next(this.searchControl.value);
  }
}
