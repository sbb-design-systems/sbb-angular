import { Directionality } from '@angular/cdk/bidi';
import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _ViewRepeater,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  CdkTable,
  CDK_TABLE,
  DataRowOutlet,
  FooterRowOutlet,
  HeaderRowOutlet,
  NoDataRowOutlet,
  RenderRow,
  RowContext,
  StickyPositioningListener,
  STICKY_POSITIONING_LISTENER,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import { DOCUMENT } from '@angular/common';
import {
  afterNextRender,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  inject,
  Inject,
  Injector,
  IterableDiffers,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
@Directive({
  selector: 'sbb-table[recycleRows], table[sbb-table][recycleRows]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
  standalone: true,
})
export class SbbRecycleRows {}

/**
 * Wrapper for the CdkTable with Sbb design styles.
 */
@Component({
  selector: 'sbb-table, table[sbb-table]',
  exportAs: 'sbbTable',
  // Note that according to MDN, the `caption` element has to be projected as the **first**
  // element in the table. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
  // We can't reuse `CDK_TABLE_TEMPLATE` because it's incompatible with local compilation mode.
  template: `
    <ng-content select="caption" />
    <ng-content select="colgroup, col" />
    <!--
        Unprojected content throws a hydration error so we need this to capture it.
        It gets removed on the client so it doesn't affect the layout.
      -->
    @if (_isServer) {
      <ng-content />
    }
    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet />
      </thead>
      <tbody role="rowgroup">
        <ng-container rowOutlet />
        <ng-container noDataRowOutlet />
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet />
      </tfoot>
    } @else {
      <ng-container headerRowOutlet />
      <ng-container rowOutlet />
      <ng-container noDataRowOutlet />
      <ng-container footerRowOutlet />
    }
  `,
  host: {
    class: 'sbb-table',
    '[class.sbb-table-fixed-layout]': 'fixedLayout',
  },
  providers: [
    // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
    //  is only included in the build if used.
    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
    { provide: CdkTable, useExisting: SbbTable },
    { provide: CDK_TABLE, useExisting: SbbTable },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
})
export class SbbTable<T> extends CdkTable<T> implements OnInit, OnDestroy {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass: string = 'sbb-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement: boolean = false;

  private _destroyed = new Subject<void>();

  private injector = inject(Injector);

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string,
    @Optional() dir: Directionality,
    @Inject(DOCUMENT) document: any,
    platform: Platform,
    @Inject(_VIEW_REPEATER_STRATEGY)
    viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
    @Inject(_COALESCED_STYLE_SCHEDULER)
    coalescedStyleScheduler: _CoalescedStyleScheduler,
    private readonly _viewportRulerSbb: ViewportRuler,
    @Optional()
    @SkipSelf()
    @Inject(STICKY_POSITIONING_LISTENER)
    stickyPositioningListener: StickyPositioningListener,
    /**
     * @deprecated `_unusedNgZone` parameter to be removed.
     * @breaking-change 19.0.0
     */
    @Optional() _unusedNgZone?: NgZone,
  ) {
    super(
      differs,
      changeDetectorRef,
      elementRef,
      role,
      dir,
      document,
      platform,
      viewRepeater,
      coalescedStyleScheduler,
      _viewportRulerSbb,
      stickyPositioningListener,
    );
  }

  override ngOnInit() {
    super.ngOnInit();
    // If more than one column is sticky, the left offset is calculated at a wrong
    // time by cdk and sticky columns can get overlapped.
    // This workaround calculates sticky styles whenever the viewport has changed
    // using a Promise.resolve() to postpone data calculation to the time the content is already placed in DOM.
    // See also https://github.com/angular/components/issues/15885.
    afterNextRender(
      () => {
        this._viewportRulerSbb
          .change(150)
          .pipe(takeUntil(this._destroyed))
          .subscribe(() => {
            Promise.resolve().then(() => {
              this.updateStickyColumnStyles();
            });
          });
      },
      { injector: this.injector },
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
}
