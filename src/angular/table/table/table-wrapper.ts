import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
  passive: true,
}) as EventListenerOptions;

/**
 * The scroll state of the table. 'none' implies no scrollbar, 'both' indicates
 * the scrollbar is in the middle of the scroll width and 'left' and 'right' means
 * that there is an offset at either the left or right end of the scroll container.
 */
export type SbbTableWrapperScrollOffset = 'none' | 'both' | 'left' | 'right';

@Directive({
  selector: 'sbb-table-wrapper',
  host: {
    class: 'sbb-table-wrapper sbb-scrollbar',
    '[attr.tabindex]': 'focusable ? 0 : null',
    role: 'section',
  },
})
export class SbbTableWrapper implements AfterViewInit, OnDestroy {
  private _destroyed = new Subject<void>();

  /** Whether the table wrapper is focusable. */
  @Input()
  get focusable(): boolean {
    return this._focusable;
  }
  set focusable(value: BooleanInput) {
    this._focusable = coerceBooleanProperty(value);
  }
  private _focusable: boolean = true;

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    private _viewportRuler: ViewportRuler,
  ) {}

  ngAfterViewInit(): void {
    const resize = this._viewportRuler.change(150);

    this._ngZone.runOutsideAngular(() => {
      merge(
        fromEvent(this._elementRef.nativeElement, 'scroll', passiveEventListenerOptions),
        resize,
      )
        .pipe(
          startWith(null! as any),
          map(() => this._calculateScrollOffset()),
          distinctUntilChanged(),
          takeUntil(this._destroyed),
        )
        .subscribe((state) => {
          this._elementRef.nativeElement.classList.remove(
            `sbb-table-wrapper-offset-none`,
            `sbb-table-wrapper-offset-left`,
            `sbb-table-wrapper-offset-right`,
            `sbb-table-wrapper-offset-both`,
          );
          this._elementRef.nativeElement.classList.add(`sbb-table-wrapper-offset-${state}`);
        });
    });
  }

  /**
   * Calculate whether the scroll offset is none, left, right or on both sides.
   */
  private _calculateScrollOffset(): SbbTableWrapperScrollOffset {
    const element = this._elementRef.nativeElement;
    if (element.scrollWidth === element.offsetWidth) {
      return 'none';
    }
    const isAtStart = element.scrollLeft === 0;
    // In some cases the combined value of scrollLeft and offsetWidth is off by
    // 1 pixel from the scrollWidth.
    const isAtEnd = element.scrollWidth - element.scrollLeft - element.offsetWidth <= 1;

    if (isAtStart) {
      return isAtEnd ? 'none' : 'right';
    }
    return isAtEnd ? 'left' : 'both';
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
