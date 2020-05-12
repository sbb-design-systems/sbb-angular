import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbSortDirective, SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_EXAMPLE_DATA } from '../table-example-data';

@Component({
  selector: 'sbb-table-sort-example',
  templateUrl: './sortable-table-example.component.html',
})
export class SortableTableExampleComponent implements AfterViewInit {
  displayedColumns: string[] = ['letter', 'number', 'word', 'date'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA.slice());

  @ViewChild(SbbSortDirective) sort: SbbSortDirective;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}
