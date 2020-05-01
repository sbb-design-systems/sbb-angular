import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbPaginatorComponent } from '@sbb-esta/angular-business/pagination';
import {
  SbbSortDirective,
  SbbTableDataSource,
  TableComponent
} from '@sbb-esta/angular-business/table';

import { VehicleExampleItem, VEHICLE_EXAMPLE_DATA } from '../table-example-data';

interface VehicleFilter {
  global?: string;
  name?: string;
  description?: string;
}

/**
 * Data source for the AdvancedTableExample view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AdvancedTableExampleDataSource extends SbbTableDataSource<VehicleExampleItem> {
  constructor(data: VehicleExampleItem[]) {
    super(data);
  }

  /** Stream that emits when a new filter string is set on the data source. */
  // private readonly _filter = new BehaviorSubject<string>('{}');

  filterPredicate: (data: VehicleExampleItem, filter: string) => boolean = (
    data: VehicleExampleItem,
    filter: string
  ): boolean => {
    const vehicleFilter: VehicleFilter = JSON.parse(filter);

    let matchesName = true;
    let matchesDescription = true;
    let matchesGlobal = true;

    if (vehicleFilter.global) {
      // Transform the data into a lowercase string of all property values.
      const dataStr = Object.keys(data)
        .reduce((currentTerm: string, key: string) => {
          // Use an obscure Unicode character to delimit the words in the concatenated string.
          // This avoids matches where the values of two columns combined will match the user's query
          // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
          // that has a very low chance of being typed in by somebody in a text field. This one in
          // particular is "White up-pointing triangle with dot" from
          // https://en.wikipedia.org/wiki/List_of_Unicode_characters
          return currentTerm + (data as { [key: string]: any })[key] + '◬';
        }, '')
        .toLowerCase();

      matchesGlobal = matchesData(dataStr, vehicleFilter.global);
    }

    if (vehicleFilter.name) {
      matchesName = matchesData(data.name, vehicleFilter.name);
    }

    if (vehicleFilter.description) {
      matchesDescription = matchesData(data.description, vehicleFilter.description);
    }

    return matchesName && matchesDescription && matchesGlobal;
  };
}

const matchesData = (data: string, search: string): boolean => {
  return data.toLowerCase().indexOf(search.trim().toLowerCase()) !== -1;
};

@Component({
  selector: 'sbb-advanced-table-example',
  templateUrl: './advanced-table-example.component.html'
})
export class AdvancedTableExampleComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'power', 'description'];

  @ViewChild(SbbPaginatorComponent) paginator: SbbPaginatorComponent;
  @ViewChild(SbbSortDirective) sort: SbbSortDirective;
  @ViewChild(TableComponent) table: TableComponent<VehicleExampleItem>;

  dataSource: AdvancedTableExampleDataSource = new AdvancedTableExampleDataSource(
    VEHICLE_EXAMPLE_DATA
  );

  vehicleFilter: VehicleFilter = {};

  get displayedColumnsFilter(): string[] {
    return this.displayedColumns.map(value => 'filter-' + value);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.vehicleFilter);
  }
}
