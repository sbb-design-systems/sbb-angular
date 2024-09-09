import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';
import { SbbSearchModule } from '@sbb-esta/angular/search';
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
  templateUrl: 'search-historic-railway-pictures-example.html',
  styleUrls: ['search-historic-railway-pictures-example.css'],
  standalone: true,
  imports: [
    SbbSearchModule,
    SbbInputModule,
    FormsModule,
    SbbAutocompleteModule,
    ReactiveFormsModule,
    SbbOptionModule,
    SbbLoadingIndicatorModule,
  ],
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

  private _http = inject(HttpClient);
  private _destroyed = new Subject<void>();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        map((newValue) =>
          this.cities.filter(
            (option) =>
              newValue && option.toLocaleUpperCase().indexOf(newValue.toLocaleUpperCase()) > -1,
          ),
        ),
        takeUntil(this._destroyed),
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
                .toLowerCase()}`,
          ),
        ),
        map((result) =>
          result.records.map(
            (record) =>
              ({
                id: record.fields.filename.id,
                station: record.fields.bahnhof,
              }) as ImageRecord,
          ),
        ),
        takeUntil(this._destroyed),
      )
      .subscribe({
        next: (searchResults) => {
          this.showSpinner = false;
          this.searchResults = searchResults;
        },
        complete: () => (this.showSpinner = false),
        error: () => (this.showSpinner = false),
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  search() {
    this.searchSubject.next(this.searchControl.value || '');
  }
}
