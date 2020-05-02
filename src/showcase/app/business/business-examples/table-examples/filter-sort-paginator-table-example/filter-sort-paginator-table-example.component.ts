import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbPaginatorComponent } from '@sbb-esta/angular-business/pagination';
import {
  SbbSortDirective,
  SbbTableDataSource,
  TableComponent,
  TableFilter
} from '@sbb-esta/angular-business/table';

import { VehicleExampleItem, VEHICLE_EXAMPLE_DATA } from '../table-example-data';

interface VehicleFilter extends TableFilter {
  name?: string;
  description?: string;
}

@Component({
  selector: 'sbb-filter-sort-paginator-table-example',
  templateUrl: './filter-sort-paginator-table-example.component.html'
})
export class FilterSortPaginatorTableExampleComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'power', 'description'];

  @ViewChild(SbbPaginatorComponent) paginator: SbbPaginatorComponent;
  @ViewChild(SbbSortDirective) sort: SbbSortDirective;
  @ViewChild(TableComponent) table: TableComponent<VehicleExampleItem>;

  dataSource = new SbbTableDataSource<VehicleExampleItem, VehicleFilter>(VEHICLE_EXAMPLE_DATA);

  vehicleFilter: VehicleFilter = {};

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  applyFilter() {
    this.dataSource.filter = this.vehicleFilter;
  }
}
