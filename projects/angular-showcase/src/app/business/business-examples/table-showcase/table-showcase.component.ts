import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA_1, TABLE_SHOWCASE_DATA_2 } from './table-showcase-data';

@Component({
  selector: 'sbb-table-showcase',
  templateUrl: './table-showcase.component.html',
  styleUrls: ['./table-showcase.component.scss']
})
export class TableShowcaseComponent {}

@Component({
  selector: 'sbb-table-showcase-1',
  templateUrl: './table-showcase-1.component.html'
})
export class TableShowcase1Component {
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

@Component({
  selector: 'sbb-table-showcase-2',
  templateUrl: './table-showcase-2.component.html'
})
export class TableShowcase2Component {
  displayedColumns: string[] = ['deviceName', 'orderDate', 'arrivalDate', 'lifecycleEnd', 'status'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA_2, [
    ['orderDate', 'arrivalDate', 'lifecycleEnd']
  ]);

  isGroup(index, item): boolean {
    return item.isGroupBy;
  }
}
