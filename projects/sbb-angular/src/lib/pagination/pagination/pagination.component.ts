import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { PageDescriptor } from '../page-descriptor.model';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface PageChangeEvent {
  currentPage: number;
  selectedPage: number;
}

export interface RouterPaginationLink {
  routerLink: string | any[];
}

export interface LinkGeneratorResult extends NavigationExtras, RouterPaginationLink { }

@Component({
  selector: 'sbb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnChanges, OnInit, AfterViewInit, AfterViewChecked {


  /**
   * The starting page of the pagination
   */
  @Input()
  initialPage = 1;

  /**
   * Maximum length of the pagination
   */
  @Input()
  maxPage: number;

  /**
   * This event can be used by parent components to handle events on page change
   */
  @Output()
  pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();


  /**
   * A custom function called everytime a new pagination item has been clicked
   */
  @Input()
  linkGenerator?: (page: { index: number, displayNumber: number }) => LinkGeneratorResult;

  @ViewChildren('pageButton') buttons: QueryList<ElementRef<any>>;

  /**
   * Amount of pagination rotating items
   */
  maxSize = 3;

  /**
   * Pagination page numbers
   */
  pages: Array<number> = [];

  pageDescriptors: BehaviorSubject<Array<PageDescriptor>> = new BehaviorSubject<Array<PageDescriptor>>([]);

  /**
   * Used to know if current page has a previous page
   */
  hasPrevious(): boolean { return this.initialPage > 1; }

  /**
   * Used to know if current page has a next page
   */
  hasNext(): boolean { return this.initialPage < this.maxPage; }

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngAfterViewInit() {
    if (this.buttons) {
      this.buttons.changes.subscribe((btns: QueryList<ElementRef>) => {
        const selectedElement = btns.find(el => el.nativeElement.classList.contains('sbb-pagination-item-selected'));
        if (selectedElement) {
          selectedElement.nativeElement.focus();
        }
      });
    }
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Selects the page just clicked or activated by keyboard and calls the linkGenerator method if defined
   */
  selectPage(pageNumber: number): void {
    if (this.initialPage !== pageNumber) {
      this.updatePages(pageNumber);
    }
  }

  ngOnInit(): void {
    if (!this.maxPage) {
      throw new Error('You must add the maxPage attribute to the <sbb-pagination> element.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void { this.updatePages(this.initialPage); }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private applyEllipses(start: number, end: number) {

    if (start > 0) {
      if (start > 1) {
        this.pages.unshift(-1);
      }
      this.pages.unshift(1);
    }
    if (end < this.maxPage) {
      if (end < (this.maxPage - 1)) {
        this.pages.push(-1);
      }
      this.pages.push(this.maxPage);
    }

  }

  /**
   * Rotates page numbers based on maxSize items visible.
   * Currently selected page stays in the middle:
   *
   * Ex. for selected page = 6:
   * [5,*6*,7] for maxSize = 3
   * [4,5,*6*,7] for maxSize = 4
   */
  private applyRotation(): [number, number] {
    let start = 0;
    let end = this.maxPage;
    const leftOffset = Math.floor(this.maxSize / 2);
    const rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;

    if (this.maxPage > 5) {
      if (this.initialPage <= leftOffset + 1) {
        // very beginning, no rotation -> [0..maxSize]
        end = this.maxSize + 1;
      } else if (this.maxPage - this.initialPage <= leftOffset) {
        // very end, no rotation -> [len-maxSize..len]
        start = this.maxPage - this.maxSize - 1;
      } else {
        // rotate
        start = this.initialPage - leftOffset - 1;
        end = this.initialPage + rightOffset;
      }
    }

    return [start, end];
  }

  private getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }

  private setPageInRange(newPageNo) {
    const prevPageNo = this.initialPage;
    this.initialPage = this.getValueInRange(newPageNo, this.maxPage, 1);

    if (this.initialPage !== prevPageNo) {
      this.pageChange.emit({ currentPage: prevPageNo, selectedPage: this.initialPage });
    }
  }

  private updatePages(newPage: number) {
    // fill-in model needed to render pages
    this.pages.length = 0;
    for (let i = 1; i <= this.maxPage; i++) {
      this.pages.push(i);
    }

    // set page within 1..max range
    this.setPageInRange(newPage);

    // apply maxSize if necessary
    if (this.maxSize > 0 && this.maxPage > this.maxSize) {
      let start = 0;
      let end = this.maxPage;

      [start, end] = this.applyRotation();

      this.pages = this.pages.slice(start, end);
      // adding ellipses
      this.applyEllipses(start, end);
    }
    this.buildPageDescriptors(this.pages);
  }

  private buildPageDescriptors(pages: Array<number>) {
    this.pageDescriptors.next(pages.map(page => {
      return new PageDescriptor(page, page - 1, this.maxPage, this.initialPage, this.linkGenerator);
    }));
  }


}
