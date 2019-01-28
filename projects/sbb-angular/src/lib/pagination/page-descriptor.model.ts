import { NavigationExtras } from '@angular/router';

export interface PageChangeEvent {
  /** Current page number. */
  currentPage: number;
  /** Current index of page selected. */
  selectedPage: number;
}

export interface RouterPaginationLink {
  /** Router reference to navigate between page buttons. */
  routerLink: string | any[];
}

export interface LinkGeneratorResult extends NavigationExtras, RouterPaginationLink { }

export interface Page {
  /** Index of page. */
  index: number;
  /** Page number displayed. */
  displayNumber: number;
}

export class PageDescriptor {

  constructor(displayNumber: number, index: number, maxPage: number, selectedPage: number, linkGenerator, ) {
    this.displayNumber = displayNumber;
    this.index = index;

    this.hasPrevious = displayNumber > 1;
    this.hasNext = displayNumber < maxPage;
    this.isEllipsis = displayNumber === -1;
    this.tabIndex = this.isEllipsis || this.displayNumber === selectedPage ? -1 : 0;
    this.isSelected = selectedPage === displayNumber;
    if (linkGenerator && !this.isEllipsis) {
      if (this.hasPrevious) {
        this.previousLink = linkGenerator({ displayNumber: displayNumber - 1, index: index - 1 });
      }
      if (this.hasNext) {
        this.nextLink = linkGenerator({ displayNumber: displayNumber + 1, index: index + 1 });
      }
      this.link = linkGenerator({ displayNumber: displayNumber, index: index });
    }
  }
  /** Page number displayed. */
  displayNumber: number;
  /** Index of page. */
  index: number;
  tabIndex = 0;
  /** Used to know if current page has a previous page button. */
  hasPrevious?= false;
  /** Used to know if current page has a next page button. */
  hasNext?= false;
  /** Ellipsis status of a page. */
  isEllipsis?= false;
  /** Used to know if current page link has a previous page link. */
  previousLink?: LinkGeneratorResult = null;
   /** Used to know if current page link has a next page link. */
  nextLink?: LinkGeneratorResult = null;
  /** Refers to the pagination item clicked. */
  link?: LinkGeneratorResult = null;
  /** Initial status of page. */
  isSelected = false;

}
