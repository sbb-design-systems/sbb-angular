import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

const range = (length: number, offset = 0) => Array.from({ length }, (_, k) => k + offset);

const MAX_PAGE_SIZE = 3;

export class PageChangeEvent {
  constructor(
    /** Index of page. */
    public index: number,
    /** Page number displayed. */
    public displayNumber: number
  ) {}
}

@Component({
  selector: 'sbb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit {
  /** @docs-private */
  @HostBinding('attr.role')
  role = 'navigation';

  /** Amount of pages of the pagination. */
  @Input()
  get length() {
    return this._maxPage.value;
  }
  set length(length: number) {
    this._maxPage.next(length);
    if (length <= this.pageIndex) {
      this.pageIndex = length - 1;
    }
  }

  /** The currently selected page (zero-based). */
  @Input()
  get pageIndex() {
    return this._currentPage.value;
  }
  set pageIndex(page: number) {
    this._currentPage.next(page);
  }

  /** This event can be used by parent components to handle events on page change. */
  @Output()
  pageChange = new EventEmitter<PageChangeEvent>();

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

  ngOnInit(): void {
    if (!this.length) {
      throw new Error('You must add the length attribute to the <sbb-pagination> element.');
    }

    const currentPage = this._currentPage.asObservable().pipe(distinctUntilChanged());
    const maxPage = this._maxPage.asObservable().pipe(distinctUntilChanged());
    this.hasPreviousPage = currentPage.pipe(map(p => p > 0));
    this.hasNextPage = combineLatest(currentPage, maxPage, (c, m) => c < m - 1);
    this.pageRange = combineLatest(currentPage, maxPage, (c, m) => {
      if (m <= MAX_PAGE_SIZE + 2) {
        return range(m);
      } else if (c < MAX_PAGE_SIZE) {
        return [...range(MAX_PAGE_SIZE + 1), null, m - 1];
      } else if (c >= m - MAX_PAGE_SIZE) {
        return [0, null, ...range(MAX_PAGE_SIZE + 1, m - 1 - MAX_PAGE_SIZE)];
      } else {
        return [0, null, c - 1, c, c + 1, null, m - 1];
      }
    });
  }

  /**
   * Select the page by index.
   * @param index The index to select.
   */
  selectByIndex(index: number) {
    if (index < 0 || index >= this.length) {
      return;
    }

    this.pageIndex = index;
    this.pageChange.emit(new PageChangeEvent(index, index + 1));
  }

  /** @docs-private */
  _pageClick(index: number) {
    this.selectByIndex(index);
  }
}
