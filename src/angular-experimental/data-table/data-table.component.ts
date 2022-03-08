import { CollectionViewer } from '@angular/cdk/collections/collection-viewer';
import {
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { SbbPaginator } from '@sbb-esta/angular/pagination';
import { SbbSort, SbbTableFilter } from '@sbb-esta/angular/table';
import { Observable } from 'rxjs';

import { SbbDataTableColumnComponent } from './column.component';
import { SbbDataTableRowGroupComponent } from './row-group.component';

export interface SbbDataTableDataSource<T, F extends SbbTableFilter | string = string> {
  connect(collectionViewer: CollectionViewer): Observable<T[]>;

  disconnect(collectionViewer: CollectionViewer): void;

  get sort(): SbbSort | null;

  set sort(sort: SbbSort | null);

  get paginator(): SbbPaginator | null;

  set paginator(paginator: SbbPaginator | null);

  set filter(filter: F);

  get filteredData(): T[];

  loading?: Observable<boolean>;
}

@Component({
  selector: 'sbb-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class SbbDataTableComponent<T, F extends SbbTableFilter | string> implements OnInit {
  @Output()
  rowClick: EventEmitter<T> = new EventEmitter<T>();

  @Input()
  dataSource!: SbbDataTableDataSource<T, F>;

  @Input()
  pageSize?: number;

  @Input()
  loading: boolean = false;

  @Input()
  noDataText?: string;

  @Input()
  sortDirection: 'asc' | 'desc' = 'asc';

  @Input()
  sortColumn: string = '';

  @Input()
  get stickyHeader(): boolean {
    return this._stickyHeader;
  }

  set stickyHeader(value: unknown) {
    this._stickyHeader = value !== undefined && value !== false;
  }

  private _stickyHeader = false;

  @ContentChildren(SbbDataTableColumnComponent)
  columns?: QueryList<SbbDataTableColumnComponent<T>>;

  @ContentChild(SbbDataTableRowGroupComponent)
  rowGroup?: SbbDataTableRowGroupComponent<T>;

  @ViewChild(SbbPaginator, { static: true }) paginator?: SbbPaginator;

  @ViewChild(SbbSort, { static: true }) sort?: SbbSort;

  get columnNames(): string[] {
    return this.columns?.map((c) => c.id) ?? [];
  }

  get hasFilterColumns(): boolean {
    return this.columns?.some((c) => !!c.columnFilterDirective) ?? false;
  }

  get filterColumnNames(): string[] {
    return this.columns?.map((c) => `${c.id}-filter`) ?? [];
  }

  get filterColumns(): Iterable<SbbDataTableColumnComponent<T>> {
    return this.columns?.filter((c) => !!c.columnFilterDirective) ?? [];
  }

  ngOnInit() {
    if (this.paginator && this.pageSize) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  getCellClass(cellClass: undefined | string | ((element: T) => string | undefined), element: T) {
    if (!cellClass) {
      return undefined;
    }

    return typeof cellClass === 'string' ? cellClass : cellClass(element);
  }

  handleRowClick(row: T) {
    this.rowClick.next(row);
  }
}
