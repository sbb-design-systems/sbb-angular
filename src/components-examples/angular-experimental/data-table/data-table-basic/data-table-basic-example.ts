import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular/table';

import { DATA } from '../data';

interface Row {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const data: Row[] = DATA.slice(0, 5);

/**
 * @title Basic Example
 * @order 10
 */
@Component({
  selector: 'sbb-data-table-basic-example',
  templateUrl: './data-table-basic-example.html',
})
export class DataTableBasicExample {
  dataSource = new SbbTableDataSource<Row>(data);
}
