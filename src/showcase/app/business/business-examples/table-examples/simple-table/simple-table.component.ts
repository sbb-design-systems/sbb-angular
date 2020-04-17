import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

import { TABLE_EXAMPLE_DATA_SIMPLE } from '../table-example-data';

@Component({
  selector: 'sbb-table-simple-example',
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
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_SIMPLE);
}
