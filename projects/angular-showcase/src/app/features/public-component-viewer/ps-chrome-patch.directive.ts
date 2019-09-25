import { AfterViewInit, Directive, ElementRef, OnDestroy, Self } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { interval, merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'perfect-scrollbar'
})
export class PsChromePatchDirective implements OnDestroy, AfterViewInit {
  private _destroy = new Subject();

  constructor(
    private _elementRef: ElementRef,
    @Self() private _perfectScrollbar: PerfectScrollbarComponent
  ) {}

  ngAfterViewInit(): void {
    const element: HTMLElement = this._elementRef.nativeElement;
    if (!element.scrollTo) {
      return;
    }

    const directiveElement: HTMLElement = this._perfectScrollbar.directiveRef.elementRef
      .nativeElement;
    merge(interval(100), this._perfectScrollbar.psXReachEnd)
      .pipe(
        takeUntil(this._destroy),
        filter(() => directiveElement.getBoundingClientRect().top < 0)
      )
      .subscribe(() => element.scrollTo(0, 0));
  }

  ngOnDestroy(): void {
    this._destroy.next();
  }
}
