import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { SbbSort, SbbTableDataSource } from '@sbb-esta/angular/table';

/**
 * @title Sticky Table Example
 * @order 20
 */
@Component({
  selector: 'sbb-sticky-table-example',
  styleUrls: ['sticky-table-example.css'],
  templateUrl: 'sticky-table-example.html',
})
export class StickyTableExample {
  displayedColumns: string[] = [
    'line',
    'from',
    'to',
    'provider',
    'year',
    'countTrains',
    'tons',
    'timestamp',
    'recordId',
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource<any>([]);
  loading: boolean = true;

  @ViewChild(SbbSort) set content(sort: SbbSort) {
    this.dataSource.sort = sort;
  }

  constructor(httpClient: HttpClient) {
    httpClient
      .get(
        'https://data.sbb.ch/api/records/1.0/search/?dataset=zugzahlen&q=isb%3DSBB&rows=80&facet=isb&facet=strecke_bezeichnung&facet=strecke_art&facet=bp_von_abschnitt&facet=bp_bis_abschnitt&facet=jahr'
      )
      .subscribe((data: any) => {
        this.dataSource.data = data.records.map((record: any) => ({
          line: record.fields.strecke_bezeichnung,
          from: record.fields.bp_von_abschnitt_bezeichnung,
          to: record.fields.bp_bis_abschnitt_bezeichnung,
          provider: record.fields.isb,
          year: record.fields.jahr,
          countTrains: record.fields.anzahl_zuege,
          tons: record.fields.gesamtbelastung_bruttotonnen,
          timestamp: record.record_timestamp,
          recordId: record.recordid.slice(0, 4),
        }));

        this.loading = false;
      });
  }
}
