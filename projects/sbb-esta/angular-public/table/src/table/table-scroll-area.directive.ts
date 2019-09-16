import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  Self,
  SimpleChanges
} from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const stickySupported =
  typeof CSS !== 'undefined' &&
  CSS.supports(
    ['', '-o-', '-webkit-', '-moz-', '-ms-'].map(p => `(position: ${p}sticky)`).join(' or ')
  );

@Directive({
  selector: '[sbbTableScrollArea]'
})
export class ScrollAreaDirective implements OnChanges, OnDestroy {
  private _scrollListener = new Subject();

  /** Types of pin mode. */
  @Input() pinMode: 'off' | 'on';
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

  constructor(@Self() private _perfectScrollbar: PerfectScrollbarComponent) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!stickySupported) {
      return;
    } else if (
      changes.pinMode.currentValue === 'on' &&
      (changes.pinMode.firstChange ||
        changes.pinMode.previousValue !== changes.pinMode.currentValue)
    ) {
      this._perfectScrollbar.psXReachStart
        .pipe(takeUntil(this._scrollListener))
        .subscribe(() => (this._isScrolling = false));
      this._perfectScrollbar.psScrollRight
        .pipe(takeUntil(this._scrollListener))
        .subscribe(() => (this._isScrolling = true));
    } else if (
      changes.pinMode.currentValue === 'off' &&
      changes.pinMode.previousValue !== changes.pinMode.currentValue
    ) {
      this._scrollListener.next();
      this._isScrolling = false;
    }
  }

  ngOnDestroy(): void {
    this._scrollListener.next();
    this._scrollListener.complete();
  }
}
