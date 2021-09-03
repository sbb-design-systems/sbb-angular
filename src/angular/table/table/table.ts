import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import {
  CdkTable,
  CDK_TABLE,
  CDK_TABLE_TEMPLATE,
  STICKY_POSITIONING_LISTENER,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';

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
  styleUrls: ['table.css'],
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
export class SbbTable<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected override stickyCssClass: string = 'sbb-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected override needsPositionStickyOnElement: boolean = false;
}
