import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SbbTableDataSource } from '@sbb-esta/angular/table';
import { Subject, takeUntil } from 'rxjs';

import { DATA } from '../data';

interface Row {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const data: Row[] = DATA;

/**
 * @title Sorting and Filtering Example
 * @order 40
 */
@Component({
  selector: 'sbb-data-table-sorting-filtering-example',
  templateUrl: './data-table-sorting-filtering-example.html',
})
export class DataTableSortingFilteringExample implements OnDestroy {
  dataSource = new SbbTableDataSource<Row>();

  private _destroyed = new Subject<void>();

  filter = new FormGroup({
    _: new FormControl(),
    id: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
  });

  constructor() {
    this.dataSource.data = data;
    this.filter.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((filter) => (this.dataSource.filter = filter));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
