import { CollectionViewer } from '@angular/cdk/collections/collection-viewer';
import { SbbPageEvent, SbbPaginator } from '@sbb-esta/angular/pagination';
import { SbbSort, SbbSortState, SbbTableFilter } from '@sbb-esta/angular/table';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  Subject,
  tap,
} from 'rxjs';

import { SbbDataTableDataSource } from './data-table.component';

export abstract class SbbDataTableRemoteTableDataSource<T, F extends SbbTableFilter | string>
  implements SbbDataTableDataSource<T, F>
{
  private _destroyed = new Subject<void>();

  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  abstract execLoad(
    sort?: { column: string; direction: 'asc' | 'desc' },
    page?: { pageSize: number; pageIndex: number },
    filter?: F
  ): Observable<{ data: T[]; length: number; pageIndex: number }>;

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    const sortChange: Observable<SbbSortState | null | void> = this._sort
      ? (merge(this._sort.sortChange, this._sort.initialized) as Observable<SbbSortState | void>)
      : of(null);

    const pageChange: Observable<SbbPageEvent | null | void> = this._paginator
      ? (merge(
          this._paginator.page,
          this._paginator.initialized
        ) as Observable<SbbPageEvent | void>)
      : of(null);

    return combineLatest([sortChange, pageChange, this._filterSubject]).pipe(
      tap(() => this.loading.next(true)),
      mergeMap(() => {
        const sort =
          this._sort && this._sort.direction !== ''
            ? {
                column: this._sort.active,
                direction: this._sort.direction,
              }
            : undefined;
        const page = this._paginator
          ? { pageSize: this._paginator.pageSize, pageIndex: this._paginator.pageIndex }
          : undefined;
        const filter = this._filterSubject.value ?? undefined;

        return this.execLoad(sort, page, filter);
      }),
      tap((result) => {
        this.loading.next(false);
        this._filteredData = result.data;
        if (this._paginator) {
          this._paginator.pageIndex = result.pageIndex;
          this._paginator.length = result.length;
        }
      }),
      map((result) => result.data),
      catchError((err) => {
        this.loading.next(false);
        console.error('execLoad failed', err);
        throw err;
      })
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log('disconnect');
    this._destroyed.next();
    this._destroyed.complete();
  }

  get filteredData(): T[] {
    return this._filteredData;
  }

  _filteredData: T[] = [];

  set paginator(paginator: SbbPaginator | null) {
    this._paginator = paginator;
  }

  _paginator: SbbPaginator | null = null;

  set sort(sort: SbbSort | null) {
    this._sort = sort;
  }

  _sort: SbbSort | null = null;

  set filter(filter: F) {
    this._filterSubject.next(filter);
  }

  _filterSubject: BehaviorSubject<F | null> = new BehaviorSubject<F | null>(null);
}
