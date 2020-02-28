import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA_SIMPLE } from '../table-showcase-data';

@Component({
  selector: 'sbb-table-simple-showcase',
  templateUrl: './simple-table.component.html'
})
export class SimpleTableComponent {
  displayedColumns: string[] = [
    'columnOne',
    'columnTwo',
    'columnThree',
    'columnFour',
    'columnFive'
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA_SIMPLE);
}
