import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA_GROUPED_COLS } from '../table-showcase-data';

@Component({
  selector: 'sbb-table-grouped-columns-showcase',
  templateUrl: './table-grouped-columns-showcase.component.html'
})
export class TableGroupedColumnsShowcaseComponent {
  displayedColumns: string[] = [
    'leftAligned',
    'groupedOne',
    'groupedTwo',
    'groupedThree',
    'centerAligned'
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA_GROUPED_COLS, [
    ['groupedOne', 'groupedTwo', 'groupedThree']
  ]);
}
