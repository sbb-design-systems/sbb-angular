import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, SbbPaginatorComponent } from '@sbb-esta/angular-business/pagination';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { VehicleExampleItem, VEHICLE_EXAMPLE_DATA } from '../table-example-data';

@Component({
  selector: 'sbb-paginator-table-example',
  templateUrl: './paginator-table-example.component.html',
})
export class PaginatorTableExampleComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'power', 'description'];

  dataSource: SbbTableDataSource<VehicleExampleItem> = new SbbTableDataSource(VEHICLE_EXAMPLE_DATA);
  @ViewChild('paginator', { static: true }) paginator: SbbPaginatorComponent;

  pageSize: number = 5;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.paginator.page.subscribe((pageEvent: PageEvent) => console.log(pageEvent));
  }

  rowCount(rowCount: number) {
    this.dataSource = new SbbTableDataSource<VehicleExampleItem>(
      VEHICLE_EXAMPLE_DATA.slice(0, rowCount)
    );
    this.dataSource.paginator = this.paginator;
  }
}
