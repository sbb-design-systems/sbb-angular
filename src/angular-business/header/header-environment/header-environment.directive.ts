import { ContentObserver } from '@angular/cdk/observers';
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'sbb-header-environment',
  exportAs: 'sbbHeaderEnvironment',
  host: {
    class: 'sbb-header-environment',
  },
})
export class SbbHeaderEnvironment implements OnDestroy {
  private _destroyed = new Subject<void>();
  private _previousClass: string | null = null;

  constructor(contentObserver: ContentObserver, elementRef: ElementRef<HTMLElement>) {
    contentObserver
      .observe(elementRef)
      .pipe(
        map(() => {
          let text = elementRef.nativeElement.textContent;
          if (text) {
            text = text
              .replace(/[^a-zA-Z0-9-_]+/g, '-')
              .replace(/(^-+|-+$)/g, '')
              .toLowerCase();
            return `sbb-header-environment-${text}`;
          }

          return null;
        }),
        takeUntil(this._destroyed)
      )
      .subscribe((selector) => {
        const classes = elementRef.nativeElement.classList;
        if (this._previousClass) {
          classes.remove(this._previousClass);
        }
        if (selector) {
          classes.add(selector);
        }
        this._previousClass = selector;
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
