import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_EXAMPLE_DATA_GROUPED_ROWS } from '../table-example-data';

@Component({
  selector: 'sbb-table-grouped-rows-example',
  templateUrl: './grouped-rows-table.component.html'
})
export class GroupedRowsTableComponent {
  displayedColumns: string[] = ['deviceName', 'orderDate', 'arrivalDate', 'lifecycleEnd', 'status'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_GROUPED_ROWS, [
    ['orderDate', 'arrivalDate', 'lifecycleEnd']
  ]);

  isGroup(_index: number, item: { isGroupBy: boolean }): boolean {
    return item.isGroupBy;
  }
}
