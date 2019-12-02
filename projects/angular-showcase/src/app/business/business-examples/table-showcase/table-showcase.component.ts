import { Component } from '@angular/core';
import { SbbTableDataSource, Sort } from '@sbb-esta/angular-business/table';

import {
  TABLE_SHOWCASE_DATA_1,
  TABLE_SHOWCASE_DATA_2,
  TABLE_SHOWCASE_DATA_3
} from './table-showcase-data';

@Component({
  selector: 'sbb-table-showcase',
  templateUrl: './table-showcase.component.html'
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

@Component({
  selector: 'sbb-table-showcase-3',
  templateUrl: './table-showcase-3.component.html'
})
export class TableShowcase3Component {
  displayedColumns: string[] = ['letter', 'number', 'word', 'date'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA_3);

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = TABLE_SHOWCASE_DATA_3;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'letter':
          return this.compare(a.letter, b.letter, isAsc);
        case 'number':
          return this.compare(a.number, b.number, isAsc);
        case 'word':
          return this.compare(a.word, b.word, isAsc);
        case 'date':
          return this.compare(a.date.toString(), b.date.toString(), isAsc);
        default:
          return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
