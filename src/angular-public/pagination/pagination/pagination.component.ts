import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { HasInitialized, HasInitializedCtor, mixinInitialized } from '@sbb-esta/angular-core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

const range = (length: number, offset = 0) => Array.from({ length }, (_, k) => k + offset);

const MAX_PAGE_NUMBERS_DISPLAYED = 3;
/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;

export class PageChangeEvent {
  constructor(
    /** Index of page. */
    public index: number,
    /** Page number displayed. */
    public displayNumber: number,
    /** The current page size (only used in business package) */
    public pageSize: number
  ) {}
}

// Boilerplate for applying mixins to Pagination.
/** @docs-private */
export class PaginationBase {}
/** @docs-private */
export const SbbPaginationMixinBase: HasInitializedCtor & typeof PaginationBase = mixinInitialized(
  PaginationBase
);

/** @docs-private */
type Mode = 'standalone' | 'table';

@Component({
  selector: 'sbb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent extends SbbPaginationMixinBase
  implements OnInit, OnDestroy, HasInitialized {
  /** @docs-private */
  mode: Mode = 'standalone';

  /** @docs-private */
  @HostBinding('attr.role')
  role = 'navigation';

  /**
   * Number of items to display on a page. By default set to 50.
   * Only used in business package
   **/
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize = Math.max(coerceNumberProperty(value), 1);
    this._setMaxPage();
    this._correctPageIndex();
    this._emitPageChangeEvent();
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /** Amount of pages of the pagination. */
  @Input()
  get length() {
    return this.mode === 'table' ? this._length : this._maxPage.value;
  }
  set length(length: number) {
    this._length = coerceNumberProperty(length);
    this._setMaxPage();
    if (this.mode === 'table') {
      // tableDataSource will take care of correcting pageIndex
      return;
    }
    this._correctPageIndex();
  }
  private _length: number;

  private get _maxPageNumber() {
    return this.mode === 'table' ? Math.ceil(this._length / this.pageSize) : this._length;
  }

  /** The currently selected page (zero-based). */
  @Input()
  get pageIndex() {
    return this._currentPage.value;
  }
  set pageIndex(page: number) {
    this.selectByIndex(page);
  }

  /** This event can be used by parent components to handle events on page change. */
  @Output()
  pageChange = new EventEmitter<PageChangeEvent>();
  /** @docs-private */
  readonly page = this.pageChange;
  private _pageChangeGuard = new Subject<PageChangeEvent>();

  /** Reference to list of page buttons of the sbb-pagination.  */
  @ViewChildren('pageButton') _buttons: QueryList<ElementRef>;

  /** The page range, consisting of indexes and undefined where the gaps are. */
  pageRange: Observable<Array<number | null>>;
  /** Whether the pagination has a next page. */
  hasPreviousPage: Observable<boolean>;
  /** Whether the pagination has a previous page. */
  hasNextPage: Observable<boolean>;

  private _currentPage = new BehaviorSubject(0);
  private _maxPage = new BehaviorSubject(0);

  /** Whether the paginator is initialized */
  initialized: Observable<void>;
  private _destroyed = new Subject<void>();

  ngOnInit(): void {
    this._pageChangeGuard
      .pipe(
        takeUntil(this._destroyed),
        distinctUntilChanged(
          (eventA: PageChangeEvent, eventB: PageChangeEvent) =>
            eventA.index === eventB.index && eventA.pageSize === eventB.pageSize
        )
      )
      .subscribe(pageChangeEvent => this.pageChange.emit(pageChangeEvent));
    const currentPage = this._currentPage.asObservable().pipe(distinctUntilChanged());
    const maxPage = this._maxPage.asObservable().pipe(distinctUntilChanged());
    this.hasPreviousPage = currentPage.pipe(map(p => p > 0));
    this.hasNextPage = combineLatest([currentPage, maxPage]).pipe(map(([c, m]) => c < m - 1));
    this.pageRange = combineLatest([currentPage, maxPage]).pipe(
      map(([c, m]) => {
        if (m <= MAX_PAGE_NUMBERS_DISPLAYED + 2) {
          return range(m);
        } else if (c < MAX_PAGE_NUMBERS_DISPLAYED) {
          return [...range(MAX_PAGE_NUMBERS_DISPLAYED + 1), null, m - 1];
        } else if (c >= m - MAX_PAGE_NUMBERS_DISPLAYED) {
          return [
            0,
            null,
            ...range(MAX_PAGE_NUMBERS_DISPLAYED + 1, m - 1 - MAX_PAGE_NUMBERS_DISPLAYED)
          ];
        } else {
          return [0, null, c - 1, c, c + 1, null, m - 1];
        }
      })
    );
    this._markInitialized();
  }

  /**
   * Select the page by index.
   * @param index The index to select.
   */
  selectByIndex(index: number) {
    if (index < 0 || index >= this.length) {
      return;
    }

    this._currentPage.next(index);
    this._emitPageChangeEvent();
  }

  private _emitPageChangeEvent() {
    this._pageChangeGuard.next(
      new PageChangeEvent(this.pageIndex, this.pageIndex + 1, this.pageSize)
    );
  }

  /** @docs-private */
  _pageClick(index: number) {
    this.selectByIndex(index);
  }

  private _setMaxPage() {
    this._maxPage.next(this._maxPageNumber);
  }

  private _correctPageIndex() {
    if (this._maxPageNumber <= this.pageIndex) {
      this.pageIndex = this._maxPageNumber - 1;
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }
}
