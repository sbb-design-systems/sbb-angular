import { Component } from '@angular/core';
import { SbbTableDataSource, Sort } from '@sbb-esta/angular-business/table';

import { TABLE_SHOWCASE_DATA } from '../table-showcase-data';

@Component({
  selector: 'sbb-table-sort-showcase',
  templateUrl: './table-sort-showcase.component.html'
})
export class TableSortShowcaseComponent {
  displayedColumns: string[] = ['letter', 'number', 'word', 'date'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_SHOWCASE_DATA.slice());

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = TABLE_SHOWCASE_DATA;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'letter':
          return this.compare(a.letter, b.letter, isAsc);
        case 'number':
          return this.compare(a.number, b.number, isAsc);
        case 'word':
          return this.compare(a.word, b.word, isAsc);
        case 'date':
          return this.compare(a.date.toString(), b.date.toString(), isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
