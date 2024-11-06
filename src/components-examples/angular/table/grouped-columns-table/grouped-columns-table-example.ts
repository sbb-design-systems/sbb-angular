import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';

/**
 * @title Grouped Columns Table
 * @order 30
 */
@Component({
  selector: 'sbb-grouped-columns-table-example',
  templateUrl: 'grouped-columns-table-example.html',
  imports: [SbbTableModule],
})
export class GroupedColumnsTableExample {
  displayedColumns: string[] = [
    'leftAligned',
    'groupedOne',
    'groupedTwo',
    'groupedThree',
    'centerAligned',
  ];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_GROUPED_COLS);
}

const TABLE_EXAMPLE_DATA_GROUPED_COLS = [
  {
    left: 'left1',
    groupedOne: 'groupedOne1',
    groupedTwo: 'groupedTwo1',
    groupedThree: 'groupedThree1',
    center: 'center1',
  },
  {
    left: 'left2',
    groupedOne: 'groupedOne2',
    groupedTwo: 'groupedTwo2',
    groupedThree: 'groupedThree2',
    center: 'center2',
  },
  {
    left: 'left3',
    groupedOne: 'groupedOne3',
    groupedTwo: 'groupedTwo3',
    groupedThree: 'groupedThree3',
    center: 'center3',
  },
  {
    left: 'left4',
    groupedOne: 'groupedOne4',
    groupedTwo: 'groupedTwo4',
    groupedThree: 'groupedThree4',
    center: 'center4',
  },
  {
    left: 'left5',
    groupedOne: 'groupedOne5',
    groupedTwo: 'groupedTwo5',
    groupedThree: 'groupedThree5',
    center: 'center5',
  },
];
