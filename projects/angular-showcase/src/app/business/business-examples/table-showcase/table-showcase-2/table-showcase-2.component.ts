import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular-business/table';

@Component({
  selector: 'sbb-table-showcase-2',
  templateUrl: './table-showcase-2.component.html'
})
export class TableShowcase2Component {
  displayedColumns: string[] = ['deviceName', 'orderDate', 'arrivalDate', 'lifecycleEnd', 'status'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(
    [
      {
        title: 'Mobile Workplace IT',
        isGroupBy: true
      },
      {
        deviceName: 'iPhone order form',
        orderDate: '01.01.2017',
        arrivalDate: '01.01.2017',
        lifecycleEnd: '01.01.2020',
        status: 'Delivered'
      },
      {
        deviceName: 'Samsung A5',
        orderDate: '01.01.2018',
        arrivalDate: '-',
        lifecycleEnd: '-',
        status: 'Ordered'
      },
      {
        title: 'Standard Workplace IT',
        isGroupBy: true
      },
      {
        deviceName: 'Lenovo Laptop charger',
        orderDate: '01.01.2017',
        arrivalDate: '10.01.2017',
        lifecycleEnd: '01.01.2020',
        status: 'Installed'
      },
      {
        deviceName: 'Lenovo Laptop',
        orderDate: '01.01.2017',
        arrivalDate: '10.01.2017',
        lifecycleEnd: '01.01.2020',
        status: 'Installed'
      }
    ],
    [['orderDate', 'arrivalDate', 'lifecycleEnd']]
  );

  isGroup(index, item): boolean {
    return item.isGroupBy;
  }
}
