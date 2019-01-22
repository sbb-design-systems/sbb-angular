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
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { PageDescriptor } from '../page-descriptor.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { isArray, isString } from 'util';

export interface PageChangeEvent {
  currentPage: number;
  selectedPage: number;
}

export interface RouterPaginationLink {
  routerLink: string | any[];
}

export interface LinkGeneratorResult extends NavigationExtras, RouterPaginationLink { }

export interface Page {
  index: number;
  displayNumber: number;
}

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

  @ViewChildren('pageButton') buttons: QueryList<ElementRef>;
  @ViewChildren('pageLink') links: QueryList<ElementRef>;


  /**
   * Amount of rotating pagination items
   */
  maxSize = 3;

  /**
   * Pagination page numbers
   */
  pages: Array<Page> = [];

  pageDescriptors: Array<PageDescriptor> = [];

  /**
   * Used to know if current page has a previous page
   */
  hasPrevious(): boolean { return this.initialPage > 1; }

  /**
   * Used to know if current page has a next page
   */
  hasNext(): boolean { return this.initialPage < this.maxPage; }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  /**
   * Selects the page just clicked or activated by keyboard and calls the linkGenerator method if defined
   */
  selectPage(pageNumber: number): void {
    if (this.initialPage !== pageNumber || this.linkGenerator) {
      this.updatePages(pageNumber);
    }
  }

  ngOnInit(): void {
    if (!this.maxPage) {
      throw new Error('You must add the maxPage attribute to the <sbb-pagination> element.');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePages(this.initialPage);
  }

  ngAfterViewInit() {
    if (this.route.queryParams) {
      this.route.queryParams.subscribe(params => {
        if (params.page) {
          this.selectPage(params.page as number);
        } else {
          this.selectPage(1);
        }
      });
    }
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Appends ellipses and first/last page number to the displayed pages
   */
  private applyEllipses(start: number, end: number) {

    if (start > 0) {
      if (start > 1) {
        this.pages.unshift({ displayNumber: -1, index: -1 });
      }
      this.pages.unshift({ displayNumber: 1, index: 1 });
    }
    if (end < this.maxPage) {
      if (end < (this.maxPage - 1)) {
        this.pages.push({ displayNumber: -1, index: -1 });
      }
      this.pages.push({ displayNumber: this.maxPage, index: this.maxPage });
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
      this.pages.push({ displayNumber: i, index: i });
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

  private buildPageDescriptors(pages: Array<Page>) {
    this.pageDescriptors = pages.map(page => {
      return new PageDescriptor(page.displayNumber, page.index, this.maxPage, this.initialPage, this.linkGenerator);
    });

  }

  private findActivePage(el: ElementRef) {
    return Number(el.nativeElement.textContent) === this.pageDescriptors.find(page => page.isSelected).displayNumber;
  }

  linkClick($event, page: PageDescriptor) {
    this.navigateToLink(page.link);
    $event.preventDefault();
  }

  buttonClick(page: PageDescriptor) {
    this.selectPage(page.displayNumber);
    setTimeout(() => {
      if (this.buttons.length) {
        this.buttons.find(button => {
          return this.findActivePage(button);
        }).nativeElement.focus();
      }
    });
  }

  focusActive(page) {
    return page.isSelected ? 'sbb-pagination-item-selected' : '';
  }

  linkNext($event) {
    const route = this.pageDescriptors.find(page => page.isSelected).nextLink;
    this.navigateToLink(route);
    $event.preventDefault();
  }

  linkBefore($event) {
    const route = this.pageDescriptors.find(page => page.isSelected).previousLink;
    this.navigateToLink(route);
    $event.preventDefault();
  }

  private navigateToLink(linkGeneratorResult: LinkGeneratorResult) {
    let routerLink = linkGeneratorResult.routerLink;
    if (isString(linkGeneratorResult.routerLink)) {
      routerLink = (linkGeneratorResult.routerLink as string).split('/');
    }
    return this.router.navigate(routerLink as any[], linkGeneratorResult);

  }
}
