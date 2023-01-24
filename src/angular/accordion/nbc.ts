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
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

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
  width: number | null;
  height: number | null;
  isFixed: boolean = false;
  topMargin: number = 0;

  @Input() stickyTopMargin: number = 0;
  @ContentChildren(SbbExpansionPanel) _expansionPanels: QueryList<SbbExpansionPanel>;
  @ViewChild('content', { static: true }) _nbcContent: ElementRef<HTMLElement>;

  constructor(
    private _changeDetectionRef: ChangeDetectorRef,
    private _element: ElementRef,
    private _ngZone: NgZone,
    private _scrollDispatcher: ScrollDispatcher,
    private _viewportRuler: ViewportRuler
  ) {}

  private _getBoundingClientRect(): DOMRect {
    return (this._element.nativeElement as HTMLElement).getBoundingClientRect();
  }

  private _getAvailableHeight(): number {
    const rect = this._getBoundingClientRect();
    return Math.floor(rect.bottom - Math.max(this.stickyTopMargin, rect.top));
  }

  private _getCurrentHeight(): number {
    return Math.floor(this._nbcContent.nativeElement.offsetHeight);
  }

  private _updateFixedStyle() {
    const rect = this._getBoundingClientRect();
    const isFixed = rect.top <= this.stickyTopMargin;

    if (isFixed !== this.isFixed) {
      this.isFixed = isFixed;
      this._ngZone.run(() => {
        this.isFixed = isFixed;
        this.width = isFixed ? rect.width : null;
        this.height = isFixed ? rect.bottom - rect.top : null;
        this.topMargin = isFixed ? this.topMargin : 0;
        this._changeDetectionRef.markForCheck();
      });
    }
  }

  private _updateTopMargin() {
    const topMargin = Math.min(this._getAvailableHeight() - this._getCurrentHeight(), 0);

    if (topMargin !== this.topMargin) {
      this._ngZone.run(() => {
        this.topMargin = topMargin;
        this._changeDetectionRef.markForCheck();
      });
    }
  }

  private _resizePanels() {
    let currentHeightDiff = this._getAvailableHeight() - this._getCurrentHeight();
    const isScrolledUp = currentHeightDiff < 0;

    while (currentHeightDiff !== 0) {
      const panel = isScrolledUp
        ? this._expansionPanels.find((p) => p._body.nativeElement.offsetHeight > 0)
        : this._expansionPanels
            .toArray()
            .reverse()
            .find((p) => p._body.nativeElement.scrollHeight > p._body.nativeElement.offsetHeight);

      if (!panel) {
        break;
      }

      const element = panel._body.nativeElement;
      const newHeight = element.offsetHeight + currentHeightDiff;

      if (isScrolledUp) {
        currentHeightDiff = newHeight < 0 ? newHeight : 0;
        element.style.height = `${Math.max(newHeight, 0)}px`;
      } else {
        currentHeightDiff = newHeight > element.scrollHeight ? newHeight - element.scrollHeight : 0;
        element.style.height = `${Math.min(newHeight, element.scrollHeight)}px`;
      }
    }
  }

  private _updatePanelWidth() {
    const rect = this._getBoundingClientRect();
    this._ngZone.run(() => {
      this.width = this.isFixed ? rect.width : null;
      this.height = this.isFixed ? rect.bottom - rect.top : null;
      this._changeDetectionRef.markForCheck();
    });
  }

  ngAfterContentInit(): void {
    this._scrollDispatcher
      .scrolled()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        const isScrolledUp = this._getAvailableHeight() - this._getCurrentHeight() < 0;

        if (isScrolledUp) {
          this._updateFixedStyle();
          this._resizePanels();
          this._updateTopMargin();
        } else {
          this._updateTopMargin();
          this._resizePanels();
          this._updateFixedStyle();
        }
      });

    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed), debounceTime(100))
      .subscribe(() => this._updatePanelWidth());
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
