import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Component, inject, ViewChild } from '@angular/core';
import { SbbLoadingIndicatorModule } from '@sbb-esta/angular/loading-indicator';
import { SbbSort, SbbSortState, SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';

/**
 * @title Sticky Table Example
 * @order 20
 */
@Component({
  selector: 'sbb-sticky-table-example',
  styleUrls: ['sticky-table-example.css'],
  templateUrl: 'sticky-table-example.html',
  imports: [SbbTableModule, SbbLoadingIndicatorModule],
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

  private _liveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    const httpClient = inject(HttpClient);

    httpClient
      .get(
        'https://data.sbb.ch/api/records/1.0/search/?dataset=zugzahlen&q=isb%3DSBB&rows=80&facet=isb&facet=strecke_bezeichnung&facet=strecke_art&facet=bp_von_abschnitt&facet=bp_bis_abschnitt&facet=jahr',
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

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: SbbSortState) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
