import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

@Component({
  selector: 'sbb-table-grouped-rows-and-columns-example',
  templateUrl: './grouped-rows-and-columns-table-example.component.html',
})
export class GroupedRowsAndColumnsTableExampleComponent {
  displayedColumns: string[] = ['deviceName', 'orderDate', 'arrivalDate', 'lifecycleEnd', 'status'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_GROUPED_ROWS, [
    ['orderDate', 'arrivalDate', 'lifecycleEnd'],
  ]);

  isGroup(_index: number, item: { isGroupBy: boolean }): boolean {
    return item.isGroupBy;
  }
}

const TABLE_EXAMPLE_DATA_GROUPED_ROWS = [
  {
    title: 'Mobile Workplace IT',
    isGroupBy: true,
  },
  {
    deviceName: 'iPhone order form',
    orderDate: '01.01.2017',
    arrivalDate: '01.01.2017',
    lifecycleEnd: '01.01.2020',
    status: 'Delivered',
  },
  {
    deviceName: 'Samsung A5',
    orderDate: '01.01.2018',
    arrivalDate: '-',
    lifecycleEnd: '-',
    status: 'Ordered',
  },
  {
    title: 'Standard Workplace IT',
    isGroupBy: true,
  },
  {
    deviceName: 'Lenovo Laptop charger',
    orderDate: '01.01.2017',
    arrivalDate: '10.01.2017',
    lifecycleEnd: '01.01.2020',
    status: 'Installed',
  },
  {
    deviceName: 'Lenovo Laptop',
    orderDate: '01.01.2017',
    arrivalDate: '10.01.2017',
    lifecycleEnd: '01.01.2020',
    status: 'Installed',
  },
];
