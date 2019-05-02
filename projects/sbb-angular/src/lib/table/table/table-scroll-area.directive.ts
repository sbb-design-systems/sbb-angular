import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[sbbTableScrollArea]'
})
export class ScrollAreaDirective {

  /** Types of pin mode. */
  // tslint:disable-next-line:no-input-rename
  @Input('sbbTableScrollArea')
  pinMode: 'off' | 'on';
  /**
   * Wrapper class of the table.
   */
  @HostBinding('class.sbb-table-wrapper')
  tableWrapperClass = true;

  private _isScrolling = false;
  /**
   * Scrollig class of the table.
   */
  @HostBinding('class.sbb-table-is-scrolling')
  get isScrollingClass() {
    return this._isScrolling;
  }

  @HostListener('scroll', ['$event.target'])
  scrollTable(scrollTarget: any) {
    if (this.pinMode === 'on') {
      if (scrollTarget.scrollLeft > 0) {
        this._isScrolling = true;
      } else {
        this._isScrolling = false;
      }
    }
  }

}
