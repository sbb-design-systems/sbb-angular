import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA_1 } from '../table-showcase-data';

@Component({
  selector: 'sbb-table-showcase-1',
  templateUrl: './table-actions-showcase.component.html'
})
export class TableActionsShowcaseComponent {
  displayedColumns: string[] = [
    'leftAligned',
    'groupedOne',
    'groupedTwo',
    'groupedThree',
    'centerAligned'
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA_1, [
    ['groupedOne', 'groupedTwo', 'groupedThree']
  ]);

  deleteItem(element: any): void {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }
}
