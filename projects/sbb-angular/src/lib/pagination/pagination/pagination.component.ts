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
  HostBinding,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, NavigationEnd, RouterLinkActive } from '@angular/router';
import { PageDescriptor, PageChangeEvent, LinkGeneratorResult } from '../page-descriptor.model';
import { filter, debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'sbb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnChanges, OnInit, AfterViewInit {
  /** Role of the sbb-pagination. */
  @HostBinding('attr.role')
  role = 'navigation';

  /**
   * The starting page of the pagination.
   */
  @Input()
  initialPage = 1;

  /**
   * Maximum length of the pagination.
   */
  @Input()
  maxPage: number;

  /**
   * This event can be used by parent components to handle events on page change.
   */
  @Output()
  pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();


  /**
   * A custom function called everytime a new pagination item has been clicked.
   */
  @Input()
  linkGenerator?: (page: { index: number, displayNumber: number }) => LinkGeneratorResult;
  /** Reference to list of page buttons of the sbb-pagination.  */
  @ViewChildren('pageButton') buttons: QueryList<ElementRef>;
  /** Reference to list of page links of the sbb-pagination.  */
  @ViewChildren('pageLink') links: QueryList<ElementRef>;

  @ViewChildren('rla') activeLinks: QueryList<RouterLinkActive>;
  /**
   * Amount of rotating pagination items.
   */
  maxSize = 3;

  /**
   * Pagination page numbers.
   */
  pages: Array<number> = [];
  /**Pagination descriptors. */
  pageDescriptors: Array<PageDescriptor> = [];

  selectedPage$: Observable<PageDescriptor>;
  selectedPageSubject = new Subject<PageDescriptor>();

  /**
   * Used to know if current page has a previous page.
   * @return Value true/false to indicate if a previous page exists or not.
   */
  hasPrevious(): boolean { return this.initialPage > 1; }

  /**
   * Used to know if current page has a next page.
   * @return Value true/false to indicate if a next page exists or not.
   */
  hasNext(): boolean { return this.initialPage < this.maxPage; }

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }


  private getSelectedLinkPage() {
    const selectedPageIndex = this.activeLinks.toArray()
      .findIndex(page => page.isActive);
    if (selectedPageIndex === -1) {
      return this.pageDescriptors[0];
    }
    return this.pageDescriptors.find(page => page.index === selectedPageIndex);
  }

  private getSelectedButtonPage() {
    return this.pageDescriptors.find(page => page.displayNumber === this.initialPage);
  }

  /**
   * Selects the page just clicked or activated by keyboard and calls the linkGenerator method if defined.
   * @param pageNumber Page number to select.
   */
  selectPage(page: PageDescriptor): void {
    if (this.initialPage !== page.displayNumber || this.linkGenerator) {
      this.updatePages(page.displayNumber);
    }
  }

  ngOnInit(): void {
    if (!this.maxPage) {
      throw new Error('You must add the maxPage attribute to the <sbb-pagination> element.');
    }
    this.selectedPage$ = this.selectedPageSubject.asObservable();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePages(this.initialPage);
  }

  ngAfterViewInit() {
    if (this.links.length) {
      this.selectedPage$
        .subscribe((selectedPage) => {
          this.selectPage(selectedPage);
          const selectedPageIndex = this.activeLinks.toArray()
            .findIndex(page => page.isActive);
          if (selectedPageIndex === -1) {
            this.navigateToLink(this.linkGenerator({ index: 0, displayNumber: 1 }));
          }
        });
      this.selectedPageSubject.next(this.getSelectedLinkPage());
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .pipe().subscribe((event: NavigationEnd) => {
          this.changeDetectorRef.detectChanges();
        });

      this.activeLinks.changes
        .pipe(debounceTime(100))
        .subscribe(linkList => {
          const selectedPageIndex = linkList.toArray()
            .findIndex(page => page.isActive);
          if (selectedPageIndex !== -1) {
            linkList.toArray()[selectedPageIndex].element.nativeElement.focus();
          }
        });
    } else {
      this.selectedPageSubject.next(this.getSelectedButtonPage());
      this.buttons.changes.subscribe(() => {
        this.buttons.toArray()[this.getSelectedButtonPage().index].nativeElement.focus();
      });
      this.changeDetectorRef.detectChanges();

    }
  }

  /**
   * Appends ellipses and first/last page number to the displayed pages.
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

  linkClick(page) {
    this.selectedPageSubject.next(page);
    this.changeDetectorRef.detectChanges();
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
      if (!this.linkGenerator) {
        this.selectedPageSubject.next(this.getSelectedButtonPage());
      }
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
    let index = -1;
    this.pageDescriptors = pages.map((pageNumber) => {
      if (pageNumber !== -1) {
        index++;
      }
      const pageDescr = new PageDescriptor(pageNumber, index, this.maxPage, this.initialPage, this.linkGenerator);
      if (pageDescr.hasPrevious) {
        pageDescr.previousPage = new PageDescriptor(pageNumber - 1, index - 1, this.maxPage, this.initialPage, this.linkGenerator);
      }
      if (pageDescr.hasNext) {
        pageDescr.nextPage = new PageDescriptor(pageNumber + 1, index + 1, this.maxPage, this.initialPage, this.linkGenerator);
      }
      return pageDescr;
    });

  }

  /**
   * Method on click to a page button.
   * @param page Page button clicked.
   */
  buttonClick(page: PageDescriptor) {
    this.selectPage(page);
  }

  private navigateToLink(linkGeneratorResult: LinkGeneratorResult) {
    let routerLink = linkGeneratorResult.routerLink;
    if (typeof linkGeneratorResult.routerLink === 'string') {
      routerLink = (linkGeneratorResult.routerLink as string).split('/');
    }
    return this.router.navigate(routerLink as any[], linkGeneratorResult);

  }

  nextLink(page: PageDescriptor) {
    this.selectedPageSubject
      .next(new PageDescriptor(page.displayNumber + 1, page.index + 1, this.maxPage, page.displayNumber, this.linkGenerator));
  }

  previousLink(page: PageDescriptor) {
    this.selectedPageSubject
      .next(new PageDescriptor(page.displayNumber - 1, page.index - 1, this.maxPage, page.displayNumber, this.linkGenerator));
  }
}
