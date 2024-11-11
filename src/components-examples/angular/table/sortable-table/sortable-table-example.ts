import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { SbbSort, SbbSortState, SbbTableDataSource } from '@sbb-esta/angular/table';
import { SbbTableModule } from '@sbb-esta/angular/table';

/**
 * @title Sortable Table
 * @order 50
 */
@Component({
  selector: 'sbb-sortable-table-example',
  templateUrl: 'sortable-table-example.html',
  imports: [SbbTableModule, DatePipe],
})
export class SortableTableExample implements AfterViewInit {
  displayedColumns: string[] = ['letter', 'number', 'word', 'date'];
  dataSource: SbbTableDataSource<any> = new SbbTableDataSource(TABLE_EXAMPLE_DATA);

  @ViewChild(SbbSort) sort: SbbSort;

  private _liveAnnouncer = inject(LiveAnnouncer);

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: SbbSortState) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
