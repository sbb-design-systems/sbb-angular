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
  CDK_TABLE_TEMPLATE,
  RenderRow,
  RowContext,
  StickyPositioningListener,
  STICKY_POSITIONING_LISTENER,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import { DOCUMENT } from '@angular/common';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Inject,
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
})
export class SbbRecycleRows {}

/**
 * Wrapper for the CdkTable with Sbb design styles.
 */
@Component({
  selector: 'sbb-table, table[sbb-table]',
  exportAs: 'sbbTable',
  template: CDK_TABLE_TEMPLATE,
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
})
export class SbbTable<T> extends CdkTable<T> implements OnInit, OnDestroy {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected override stickyCssClass: string = 'sbb-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected override needsPositionStickyOnElement: boolean = false;

  private _destroyed = new Subject<void>();

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
    ngZone: NgZone
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
      ngZone
    );
  }

  override ngOnInit() {
    super.ngOnInit();
    // If more than one column is sticky, the left offset is calculated at a wrong
    // time by cdk and sticky columns can get overlapped.
    // This workaround calculates sticky styles whenever the viewport has changed
    // using a Promise.resolve() to postpone data calculation to the time the content is already placed in DOM.
    // See also https://github.com/angular/components/issues/15885.
    this._ngZone!.runOutsideAngular(() => {
      this._viewportRulerSbb
        .change(150)
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => {
          Promise.resolve().then(() => {
            this.updateStickyColumnStyles();
          });
        });
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
}
