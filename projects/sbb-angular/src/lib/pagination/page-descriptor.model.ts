import { LinkGeneratorResult } from './pagination';

export class PageDescriptor {

  constructor(displayNumber: number, index: number, maxPage: number, selectedPage: number, linkGenerator, ) {
    this.displayNumber = displayNumber;
    this.index = index;

    this.hasPrevious = displayNumber > 1;
    this.hasNext = displayNumber < maxPage;
    this.isEllipsis = displayNumber === -1;
    this.tabIndex = this.isEllipsis || this.displayNumber === selectedPage ? -1 : 0;
    this.isSelected = selectedPage === displayNumber;
    if (linkGenerator) {
      if (this.hasPrevious) {
        this.previousLink = linkGenerator({ displayNumber: displayNumber - 1, index: index - 1 });
      }
      if (this.hasNext) {
        this.nextLink = linkGenerator({ displayNumber: displayNumber + 1, index: index + 1 });
      }
      this.link = linkGenerator({ displayNumber: displayNumber, index: index });
    }
  }
  displayNumber: number;
  index: number;
  tabIndex = 0;
  hasPrevious?= false;
  hasNext?= false;
  isEllipsis?= false;
  previousLink?: LinkGeneratorResult = null;
  nextLink?: LinkGeneratorResult = null;
  link?: LinkGeneratorResult = null;
  isSelected = false;

}
