import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SbbSortDirective, SbbTableDataSource } from '@sbb-esta/angular-business/table';

@Component({
  selector: 'sbb-table-sort-example',
  templateUrl: './sortable-table-example.component.html',
})
export class SortableTableExampleComponent implements AfterViewInit {
  displayedColumns: string[] = ['letter', 'number', 'word', 'date'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA);

  @ViewChild(SbbSortDirective) sort: SbbSortDirective;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
}

const TABLE_EXAMPLE_DATA = [
  {
    letter: 'A',
    number: 5,
    word: 'abc',
    date: new Date(1097777640),
  },
  {
    letter: 'B',
    number: 4,
    word: 'def',
    date: new Date(939924840),
  },
  {
    letter: 'C',
    number: 3,
    word: 'ghj',
    date: new Date(782158440),
  },
  {
    letter: 'D',
    number: 2,
    word: 'klm',
    date: new Date(1413310440),
  },
  {
    letter: 'E',
    number: 1,
    word: 'nop',
    date: new Date(1255544040),
  },
];
