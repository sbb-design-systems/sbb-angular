import { Component } from '@angular/core';
import { SbbTableDataSource } from '@sbb-esta/angular/table';

import { DATA } from '../data';

interface Row {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  balance: number;
}

const data: Row[] = DATA.slice(0, 5);

/**
 * @title Formatting Example
 * @order 20
 */
@Component({
  selector: 'sbb-data-table-formatting-example',
  templateUrl: './data-table-formatting-example.html',
})
export class DataTableFormattingExample {
  dataSource = new SbbTableDataSource<Row>(data);
}
