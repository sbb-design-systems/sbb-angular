import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

@Component({
  selector: 'sbb-table-simple-example',
  templateUrl: './simple-table-example.component.html',
})
export class SimpleTableExampleComponent {
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
