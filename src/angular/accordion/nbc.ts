import { ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SbbExpansionPanel } from './expansion-panel';

@Component({
  selector: 'sbb-nbc',
  templateUrl: 'nbc.html',
  styleUrls: ['./nbc.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SbbNbc implements AfterContentInit, OnDestroy {
  private _destroyed = new Subject<void>();
  private _scrollOffsetTop: number;
  width: number | null;
  height: number | null;
  isFixed: boolean = false;
  topMargin: number = 0;

  @Input() stickyTopMargin: number = 0;
  @ContentChildren(SbbExpansionPanel) _expansionPanels: QueryList<SbbExpansionPanel>;

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _element: ElementRef,
    private _ngZone: NgZone,
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler
  ) {}

  private _updateFixedStyle() {
    const rect = this._element.nativeElement.getBoundingClientRect();
    const isFixed = rect.top <= this.stickyTopMargin;
    if (isFixed !== this.isFixed) {
      this._ngZone.run(() => {
        this.isFixed = isFixed;
        this.width = isFixed ? rect.width : null;
        this.height = isFixed ? rect.bottom - rect.top : null;
        this.topMargin = isFixed ? this.topMargin : 0;
        this._changeDetectionRef.markForCheck();
      });
    }
  }

  private _updateTopMargin(heightDiff: number): number {
    if (this.isFixed) {
      const newTopMargin = this.topMargin + heightDiff;
      this._ngZone.run(() => {
        this.topMargin = Math.min(newTopMargin, 0);
        this._changeDetectionRef.markForCheck();
      });
      return newTopMargin > 0 ? newTopMargin : 0;
    }

    return 0;
  }

  private _resizePanels(heightDiff: number) {
    let currentHeightDiff = heightDiff;
    const isScrolledUp = heightDiff < 0;

    if (!isScrolledUp) {
      currentHeightDiff = this._updateTopMargin(currentHeightDiff);
    }

    while (currentHeightDiff !== 0) {
      const panel =
        heightDiff < 0
          ? this._expansionPanels.find((p) => p._body.nativeElement.offsetHeight > 0)
          : this._expansionPanels
              .toArray()
              .reverse()
              .find((p) => p._body.nativeElement.scrollHeight > p._body.nativeElement.offsetHeight);

      if (!panel) {
        break;
      }
      const element = panel._body.nativeElement;
      const newHeight = element.offsetHeight + heightDiff;

      if (isScrolledUp) {
        currentHeightDiff = newHeight < 0 ? -newHeight : 0;
        element.style.height = `${Math.max(newHeight, 0)}px`;
      } else {
        currentHeightDiff = newHeight > element.scrollHeight ? newHeight : 0;
        element.style.height = `${Math.min(newHeight, element.scrollHeight)}px`;
      }
    }

    if (currentHeightDiff !== 0) {
      this._updateTopMargin(currentHeightDiff);
    }
  }

  private _updatePanelWidth() {
    this._ngZone.run(() => {
      const rect = this._element.nativeElement.getBoundingClientRect();
      this.width = this.isFixed ? rect.width : null;
      this.height = this.isFixed ? rect.bottom - rect.top : null;
      this._changeDetectionRef.markForCheck();
    });
  }

  ngAfterContentInit(): void {
    this._scrollOffsetTop = this._element.nativeElement.getBoundingClientRect().top;

    this._scrollDispatcher
      .scrolled()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._updateFixedStyle());

    this._scrollDispatcher
      .scrolled()
      .pipe(takeUntil(this._destroyed))
      .subscribe((scrollable) => {
        const scrollOffsetTop = scrollable!.measureScrollOffset('top');
        const scrollDistance = scrollOffsetTop - this._scrollOffsetTop;
        this._scrollOffsetTop = scrollOffsetTop;

        if (this.isFixed) {
          this._resizePanels(-scrollDistance);
        }
      });

    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._updatePanelWidth());
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
