import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_EXAMPLE_DATA_GROUPED_COLS } from '../table-example-data';

@Component({
  selector: 'sbb-table-grouped-columns-example',
  templateUrl: './grouped-columns-table.component.html'
})
export class GroupedColumnsTableComponent {
  displayedColumns: string[] = [
    'leftAligned',
    'groupedOne',
    'groupedTwo',
    'groupedThree',
    'centerAligned'
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_GROUPED_COLS, [
    ['groupedOne', 'groupedTwo', 'groupedThree']
  ]);
}
