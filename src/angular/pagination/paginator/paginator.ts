// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  InjectionToken,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { Observable, ReplaySubject } from 'rxjs';

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;

const MAX_PAGE_NUMBERS_DISPLAYED = 3;
const range = (length: number, offset = 0) => Array.from({ length }, (_, k) => k + offset);

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class SbbPageEvent {
  /**
   *
   * @param pageIndex current page index
   * @param previousPageIndex index of the page that was selected previously
   * @param pageSize current page size
   * @param length current total number of items being paged
   */
  constructor(
    public pageIndex: number,
    public previousPageIndex: number,
    public pageSize: number,
    public length: number,
  ) {}
}

/** Object that can be used to configure the default options for the paginator module. */
export interface SbbPaginatorDefaultOptions {
  /** Number of items to display on a page. By default set to 50. */
  pageSize?: number;
}

/** Injection token that can be used to provide the default options for the paginator module. */
export const SBB_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<SbbPaginatorDefaultOptions>(
  'SBB_PAGINATOR_DEFAULT_OPTIONS',
);

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
@Component({
  selector: 'sbb-paginator',
  exportAs: 'sbbPaginator',
  templateUrl: './paginator.html',
  styleUrls: ['./paginator.css'],
  inputs: ['disabled'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    class: 'sbb-paginator sbb-icon-fit',
  },
  imports: [SbbIcon],
})
export class SbbPaginator implements OnInit, OnDestroy {
  _labelPreviousPage: string = $localize`:Button label to navigate to the previous page@@sbbPaginationPreviousPage:Previous Page`;

  _labelNextPage: string = $localize`:Button label to navigate to the next page@@sbbPaginationNextPage:Next Page`;

  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _previousPageSize: number;
  private _isInitialized = false;
  private _initializedStream = new ReplaySubject<void>(1);

  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  @Input({ transform: numberAttribute })
  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    const previousPageIndex = this._pageIndex;
    this._pageIndex = this._coercePageIndexInRange(value);
    this._emitPageEvent(previousPageIndex);
    this._changeDetectorRef.markForCheck();
  }
  private _pageIndex = 0;

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input({ transform: numberAttribute })
  get length(): number {
    return this._length;
  }
  set length(value: number) {
    this._length = Math.max(value, 0);
    this.pageIndex = this.pageIndex; // ensure index recalculating
  }
  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input({ transform: numberAttribute })
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._changePageSize(value);
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /** Whether the paginator is disabled. */
  @Input({ transform: booleanAttribute })
  disabled: boolean = false;

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page: EventEmitter<SbbPageEvent> = new EventEmitter<SbbPageEvent>();

  /** Emits when the paginator is initialized. */
  initialized: Observable<void> = this._initializedStream;

  constructor(...args: unknown[]);
  constructor() {
    const defaults = inject<SbbPaginatorDefaultOptions>(SBB_PAGINATOR_DEFAULT_OPTIONS, {
      optional: true,
    });

    if (defaults) {
      const { pageSize } = defaults;

      if (pageSize != null) {
        this._pageSize = pageSize;
      }
    }
  }

  ngOnInit() {
    this._previousPageSize = this._pageSize;
    this._isInitialized = true;
    this._initializedStream.next();
  }

  ngOnDestroy() {
    this._initializedStream.complete();
  }

  /** @docs-private */
  _pageRange(): Array<number | null> {
    const m = this.numberOfPages();
    const c = this.pageIndex;
    if (m <= MAX_PAGE_NUMBERS_DISPLAYED + 2) {
      return range(m);
    } else if (c < MAX_PAGE_NUMBERS_DISPLAYED) {
      return [...range(MAX_PAGE_NUMBERS_DISPLAYED + 1), null, m - 1];
    } else if (c >= m - MAX_PAGE_NUMBERS_DISPLAYED) {
      return [
        0,
        null,
        ...range(MAX_PAGE_NUMBERS_DISPLAYED + 1, m - 1 - MAX_PAGE_NUMBERS_DISPLAYED),
      ];
    } else {
      return [0, null, c - 1, c, c + 1, null, m - 1];
    }
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    this.pageIndex = this.pageIndex + 1;
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    this.pageIndex = this.pageIndex - 1;
  }

  /** Move to the first page if not already there. */
  firstPage(): void {
    this.pageIndex = 0;
  }

  /** Move to the last page if not already there. */
  lastPage(): void {
    this.pageIndex = this.numberOfPages() - 1;
  }

  /** Move to a specific page index. */
  selectPage(index: number): void {
    this.pageIndex = index;
  }

  /** Whether there is a previous page. */
  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize !== 0;
  }

  /** Whether there is a next page. */
  hasNextPage(): boolean {
    const maxPageIndex = this.numberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize !== 0;
  }

  /** Calculate the number of pages */
  numberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  private _changePageSize(pageSize: number) {
    // Current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;

    this._pageSize = Math.max(pageSize, 0);
    this.pageIndex = Math.floor(startIndex / this._pageSize) || 0;
    this._previousPageSize = this._pageSize;
  }

  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitPageEvent(previousPageIndex: number) {
    if (
      !this._isInitialized ||
      (this.pageIndex === previousPageIndex && this._previousPageSize === this.pageSize)
    ) {
      return;
    }
    this.page.emit(new SbbPageEvent(this.pageIndex, previousPageIndex, this.pageSize, this.length));
  }

  /**
   * @docs-private
   * Checks whether the buttons for going forwards should be disabled.
   */
  _nextButtonDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  /**
   * @docs-private
   * Checks whether the buttons for going backwards should be disabled.
   */
  _previousButtonDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  /** Ensures that pageIndex is in range of pages. */
  private _coercePageIndexInRange(value: number): number {
    return Math.max(Math.min(Math.max(value, 0), this.numberOfPages() - 1), 0);
  }
}
