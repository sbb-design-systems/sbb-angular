import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA_2 } from '../table-showcase-data';

@Component({
  selector: 'sbb-table-showcase-2',
  templateUrl: './table-grouped-rows-showcase.component.html'
})
export class TableGroupedRowsShowcaseComponent {
  displayedColumns: string[] = ['deviceName', 'orderDate', 'arrivalDate', 'lifecycleEnd', 'status'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA_2, [
    ['orderDate', 'arrivalDate', 'lifecycleEnd']
  ]);

  isGroup(index, item): boolean {
    return item.isGroupBy;
  }
}
