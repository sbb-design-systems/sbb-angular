import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

import { SbbPaginatedTabHeader } from './paginated-tab-header';
import { SbbTabLabelWrapper } from './tab-label-wrapper';

/**
 * Base class with all of the `SbbTabHeader` functionality.
 * @docs-private
 */
@Directive()
// tslint:disable-next-line:class-name naming-convention
export abstract class _SbbTabHeaderBase
  extends SbbPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    ngZone: NgZone,
    platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(elementRef, changeDetectorRef, viewportRuler, ngZone, platform, animationMode);
  }

  protected _itemSelected(event: KeyboardEvent) {
    event.preventDefault();
  }
}

/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
@Component({
  selector: 'sbb-tab-header',
  templateUrl: 'tab-header.html',
  styleUrls: ['tab-header.css'],
  inputs: ['selectedIndex'],
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'sbb-tab-header',
    '[class.sbb-tab-header-pagination-controls-enabled]': `_showPaginationControls && this.variantSnapshot === 'lean'`,
  },
})
export class SbbTabHeader extends _SbbTabHeaderBase {
  @ContentChildren(SbbTabLabelWrapper, { descendants: false })
  _items: QueryList<SbbTabLabelWrapper>;
  @ViewChild('tabListContainer', { static: true }) _tabListContainer: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList: ElementRef;
  @ViewChild('tabListInner', { static: true }) _tabListInner: ElementRef;
  @ViewChild('nextPaginator') _nextPaginator: ElementRef<HTMLElement>;
  @ViewChild('previousPaginator') _previousPaginator: ElementRef<HTMLElement>;

  @Output() override selectFocusedIndex: EventEmitter<number> = new EventEmitter<number>();
  @Output() override indexFocused: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    ngZone: NgZone,
    platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(elementRef, changeDetectorRef, viewportRuler, ngZone, platform, animationMode);
  }
}
