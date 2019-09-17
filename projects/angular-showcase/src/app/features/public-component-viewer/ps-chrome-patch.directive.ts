import { Directive, ElementRef, Self } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'perfect-scrollbar'
})
export class PsChromePatchDirective {
  constructor(elementRef: ElementRef, @Self() perfectScrollbar: PerfectScrollbarComponent) {
    const element: HTMLElement = elementRef.nativeElement;
    perfectScrollbar.psXReachEnd.subscribe(() => {
      if (
        perfectScrollbar.directiveRef.elementRef.nativeElement.getBoundingClientRect().top < 0 &&
        element.scrollTo
      ) {
        element.scrollTo(0, 0);
      }
    });
  }
}
