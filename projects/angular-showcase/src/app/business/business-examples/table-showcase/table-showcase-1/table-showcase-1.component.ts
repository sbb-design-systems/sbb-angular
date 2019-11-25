import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

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
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(
    [
      {
        left: 'left1',
        groupedOne: 'groupedOne1',
        groupedTwo: 'groupedTwo1',
        groupedThree: 'groupedThree1',
        center: 'center1'
      },
      {
        left: 'left2',
        groupedOne: 'groupedOne2',
        groupedTwo: 'groupedTwo2',
        groupedThree: 'groupedThree2',
        center: 'center2'
      },
      {
        left: 'left3',
        groupedOne: 'groupedOne3',
        groupedTwo: 'groupedTwo3',
        groupedThree: 'groupedThree3',
        center: 'center3'
      },
      {
        left: 'left4',
        groupedOne: 'groupedOne4',
        groupedTwo: 'groupedTwo4',
        groupedThree: 'groupedThree4',
        center: 'center4'
      },
      {
        left: 'left5',
        groupedOne: 'groupedOne5',
        groupedTwo: 'groupedTwo5',
        groupedThree: 'groupedThree5',
        center: 'center5'
      }
    ],
    [['groupedOne', 'groupedTwo', 'groupedThree']]
  );

  deleteItem(element: any): void {
    const index = this.dataSource.data.indexOf(element);
    this.dataSource.data.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }
}
