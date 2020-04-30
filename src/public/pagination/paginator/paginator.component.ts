import { BooleanInput, coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  HostBinding,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  CanDisable,
  CanDisableCtor,
  HasInitialized,
  HasInitializedCtor,
  mixinDisabled,
  mixinInitialized
} from '@sbb-esta/angular-core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;

/** TODO */
const MAX_PAGE_NUMBERS_DISPLAYED = 3;
const range = (length: number, offset = 0) => Array.from({ length }, (_, k) => k + offset);

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
  constructor(
    /** The current page index. */
    public pageIndex: number,

    /**
     * Index of the page that was selected previously.
     */
    public previousPageIndex: number,

    /** The current page size */
    public pageSize: number,

    /** The current total number of items being paged */
    public length: number
  ) {}

  equals(other: PageEvent): boolean {
    return (
      this.pageIndex === other.pageIndex &&
      this.pageSize === other.pageSize &&
      this.length === other.length
    );
  }
}

/** Object that can be used to configure the default options for the paginator module. */
export interface SbbPaginatorDefaultOptions {
  /** Number of items to display on a page. By default set to 50. */
  pageSize?: number;
}

/** Injection token that can be used to provide the default options for the paginator module. */
export const SBB_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<SbbPaginatorDefaultOptions>(
  'SBB_PAGINATOR_DEFAULT_OPTIONS'
);

// Boilerplate for applying mixins to SbbPaginatorComponent.
/** @docs-private */
class SbbPaginatorBase {}
const sbbPaginatorBase: CanDisableCtor &
  HasInitializedCtor &
  typeof SbbPaginatorBase = mixinDisabled(mixinInitialized(SbbPaginatorBase));

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
@Component({
  selector: 'sbb-paginator',
  exportAs: 'sbbPaginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  inputs: ['disabled'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SbbPaginatorComponent extends sbbPaginatorBase
  implements OnInit, OnDestroy, DoCheck, CanDisable, HasInitialized {
  /** @docs-private */
  @HostBinding('attr.role')
  role = 'navigation';

  /** @docs-private */
  @HostBinding('class.sbb-paginator')
  sbbPaginatorClass = true;

  private _pageChangeDistinctForwarder = new Subject<PageEvent>();
  private _destroyed = new Subject<void>();

  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  @Input()
  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    const previousPageIndex = this._pageIndex;
    this._pageIndex = this._correctDownPageIndexIfNecessary(coerceNumberProperty(value));
    this._emitPageEvent(previousPageIndex);
    this._changeDetectorRef.markForCheck();
  }
  private _pageIndex = 0;

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input()
  get length(): number {
    return this._length;
  }
  set length(value: number) {
    this._length = Math.max(coerceNumberProperty(value), 0);
    this.pageIndex = this.pageIndex; // ensure index recalculating
  }
  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input()
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;

    this._pageSize = Math.max(coerceNumberProperty(value), 0);
    this.pageIndex = Math.floor(startIndex / this._pageSize) || 0;
  }
  private _pageSize: number = DEFAULT_PAGE_SIZE;

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(SBB_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: SbbPaginatorDefaultOptions
  ) {
    super();

    if (defaults) {
      const { pageSize } = defaults;

      if (pageSize != null) {
        this._pageSize = pageSize;
      }
    }

    this._pageChangeDistinctForwarder
      .pipe(
        takeUntil(this._destroyed),
        distinctUntilChanged((a: PageEvent, b: PageEvent) => a.equals(b))
      )
      .subscribe(pageEvent => this.page.emit(pageEvent));
  }

  ngOnInit() {
    this._markInitialized();
  }

  ngDoCheck(): void {
    // this._emitPageEvent(0);
  }

  ngOnDestroy(): void {
    this._destroyed.next();
  }

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
        ...range(MAX_PAGE_NUMBERS_DISPLAYED + 1, m - 1 - MAX_PAGE_NUMBERS_DISPLAYED)
      ];
    } else {
      return [0, null, c - 1, c, c + 1, null, m - 1];
    }
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    this.pageIndex++;
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    this.pageIndex--;
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

  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitPageEvent(previousPageIndex: number) {
    this._pageChangeDistinctForwarder.next(
      new PageEvent(this.pageIndex, previousPageIndex, this.pageSize, this.length)
    );
  }

  private _correctDownPageIndexIfNecessary(value: number): number {
    return Math.max(Math.min(Math.max(value, 0), this.length - 1), 0);
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_pageIndex: NumberInput;
  static ngAcceptInputType_length: NumberInput;
  static ngAcceptInputType_pageSize: NumberInput;
  static ngAcceptInputType_disabled: BooleanInput;
  // tslint:disable: member-ordering
}
