import { ContentObserver } from '@angular/cdk/observers';
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

/**
 * Optional component to indicate the environment of the app (e.g. dev, test, int, ...).
 * The component observes and extracts the text content of itself and appends
 * it (normalized) as a css class.
 *
 * e.g.:
 * <sbb-header-environment>dev</sbb-header-environment>
 * has the css class `sbb-header-environment-dev`
 */
@Directive({
  selector: 'sbb-header-environment',
  exportAs: 'sbbHeaderEnvironment',
  host: {
    class: 'sbb-header-environment',
  },
  standalone: true,
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
        takeUntil(this._destroyed),
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

/**
 * Optional component to display icon buttons next to the `<sbb-usermenu>` or the `[brand]`.
 *
 * e.g.:
 * ```
 * <sbb-header-icon-actions>
 *   <button sbb-frameless-button><sbb-icon svgIcon="magnifying-glass-small"></sbb-icon></button>
 *   <button sbb-frameless-button><sbb-icon svgIcon="bell-small"></sbb-icon></button>
 * </sbb-header-icon-actions>
 * ```
 */
@Directive({
  selector: 'sbb-header-icon-actions',
  exportAs: 'sbbHeaderIconActions',
  host: {
    class: 'sbb-header-icon-actions',
  },
  standalone: true,
})
export class SbbHeaderIconActions {}
