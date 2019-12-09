import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA } from '../table-showcase-data';

@Component({
  selector: 'sbb-table-actions-showcase',
  templateUrl: './table-actions-showcase.component.html'
})
export class TableActionsShowcaseComponent {
  displayedColumns: string[] = ['letter', 'number', 'word', 'date'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA.slice());

  deleteItem(element: any): void {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }
}
