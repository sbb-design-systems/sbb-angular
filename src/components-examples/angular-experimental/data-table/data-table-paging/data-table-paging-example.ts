import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular/table';

import { DATA } from '../data';

interface Row {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const data: Row[] = DATA;

/**
 * @title Paging Example
 * @order 30
 */
@Component({
  selector: 'sbb-data-table-paging-example',
  templateUrl: './data-table-paging-example.html',
})
export class DataTablePagingExample {
  dataSource = new SbbTableDataSource<Row>(data);
}
