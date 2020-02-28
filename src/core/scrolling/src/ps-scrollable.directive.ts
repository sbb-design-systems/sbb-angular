import { Directionality } from '@angular/cdk/bidi';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Directive, ElementRef, NgZone, OnDestroy, Optional, Self } from '@angular/core';
import { PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { merge, Observable } from 'rxjs';

/**
 * Registers the scroll detection for the perfect scrollbar directive,
 * in order for the RepositionScrollStrategy to work correctly.
 * @deprecated Use native scrollbar or css class .sbb-scrollbar instead.
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[perfectScrollbar]',
  providers: [{ provide: CdkScrollable, useExisting: PsDirectiveScrollable }]
})
// tslint:disable-next-line: directive-class-suffix
export class PsDirectiveScrollable extends CdkScrollable implements OnDestroy {
  constructor(
    @Self() private _scrollbar: PerfectScrollbarDirective,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone,
    @Optional() dir?: Directionality
  ) {
    super(elementRef, scrollDispatcher, ngZone, dir);
  }

  /** Returns observable that emits when a scroll event is fired on the host element. */
  elementScrolled(): Observable<Event> {
    return merge<CustomEvent>(this._scrollbar.psScrollY, this._scrollbar.psScrollX);
  }
}

/**
 * Registers the scroll detection for the perfect scrollbar component,
 * in order for the RepositionScrollStrategy to work correctly.
 * @deprecated Use native scrollbar or css class .sbb-scrollbar instead.
 */
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'perfect-scrollbar',
  providers: [{ provide: CdkScrollable, useExisting: PsComponentScrollable }]
})
// tslint:disable-next-line: directive-class-suffix
export class PsComponentScrollable extends CdkScrollable {
  constructor(
    @Self() private _scrollbar: PerfectScrollbarComponent,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone,
    @Optional() dir?: Directionality
  ) {
    super(elementRef, scrollDispatcher, ngZone, dir);
  }

  /** Returns observable that emits when a scroll event is fired on the host element. */
  elementScrolled(): Observable<Event> {
    return merge<CustomEvent>(this._scrollbar.psScrollY, this._scrollbar.psScrollX);
  }
}
