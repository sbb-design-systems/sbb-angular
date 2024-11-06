import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';

/**
 * @title Simple Table
 * @order 10
 */
@Component({
  selector: 'sbb-simple-table-example',
  templateUrl: 'simple-table-example.html',
  imports: [SbbTableModule],
})
export class SimpleTableExample {
  displayedColumns: string[] = [
    'columnOne',
    'columnTwo',
    'columnThree',
    'columnFour',
    'columnFive',
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_SIMPLE);
}

const TABLE_EXAMPLE_DATA_SIMPLE = [
  {
    columnOne: 'columnOne',
    columnTwo: 'columnTwo',
    columnThree: 'columnThree',
    columnFour: 'columnFour',
    columnFive: 'columnFive',
  },
  {
    columnOne: 'columnOne',
    columnTwo: 'columnTwo',
    columnThree: 'columnThree',
    columnFour: 'columnFour',
    columnFive: 'columnFive',
  },
];
