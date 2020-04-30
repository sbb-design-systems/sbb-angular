import { DataSource } from '@angular/cdk/collections';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbPaginatorComponent } from '@sbb-esta/angular-business/pagination';
import { SbbSortDirective, TableComponent } from '@sbb-esta/angular-business/table';
import { merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { VehicleExampleItem, VEHICLE_EXAMPLE_DATA } from '../table-example-data';

/**
 * Data source for the AdvancedTableExample view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AdvancedTableExampleDataSource extends DataSource<VehicleExampleItem> {
  data = VEHICLE_EXAMPLE_DATA;
  sort: SbbSortDirective;

  /**
   * Instance of the Paginator component used by the table to control what page of the data is
   * displayed. Page changes emitted by the Paginator will trigger an update to the
   * table's rendered data.
   *
   * Note that the data source uses the paginator's properties to calculate which page of data
   * should be displayed. If the paginator receives its properties as template inputs,
   * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
   * initialized before assigning it to this data source.
   */
  get paginator(): SbbPaginatorComponent | null {
    return this._paginator;
  }
  set paginator(paginator: SbbPaginatorComponent | null) {
    this._paginator = paginator;
    Promise.resolve().then(() => (this.paginator.length = this.data.length));
  }
  private _paginator: SbbPaginatorComponent | null;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<VehicleExampleItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [of(this.data), this.paginator.page, this.sort.sbbSortChange];

    return merge(...dataMutations).pipe(
      map(() => {
        return this._getPagedData(this._getSortedData([...this.data]));
      })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private _getPagedData(data: VehicleExampleItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private _getSortedData(data: VehicleExampleItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'position':
          return compare(+a.position, +b.position, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'power':
          return compare(+a.power, +b.power, isAsc);
        case 'description':
          return compare(a.description, b.description, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'sbb-advanced-table-example',
  templateUrl: './advanced-table-example.component.html'
})
export class AdvancedTableExampleComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'power', 'description'];

  @ViewChild(SbbPaginatorComponent) paginator: SbbPaginatorComponent;
  @ViewChild(SbbSortDirective) sort: SbbSortDirective;
  @ViewChild(TableComponent) table: TableComponent<VehicleExampleItem>;

  dataSource: AdvancedTableExampleDataSource = new AdvancedTableExampleDataSource();

  get displayedColumnsFilter(): string[] {
    return this.displayedColumns.map(value => 'filter-' + value);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  applyFilter(event: KeyboardEvent, column: string) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
}
