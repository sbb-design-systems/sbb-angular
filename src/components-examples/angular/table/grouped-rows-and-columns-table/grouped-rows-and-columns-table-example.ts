import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';

/**
 * @title Grouped Rows And Columns Table
 * @order 40
 */
@Component({
  selector: 'sbb-grouped-rows-and-columns-table-example',
  templateUrl: 'grouped-rows-and-columns-table-example.html',
  imports: [SbbTableModule],
})
export class GroupedRowsAndColumnsTableExample {
  displayedColumns: string[] = ['deviceName', 'orderDate', 'arrivalDate', 'lifecycleEnd', 'status'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA_GROUPED_ROWS);

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
