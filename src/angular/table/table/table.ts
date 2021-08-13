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
import { Directive } from '@angular/core';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { SbbCell, SbbHeaderCell } from '../table-cell/table-cell';

import { SbbTableDataSource } from './table-data-source';

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
 * Wrapper for the CdkTable with Material design styles.
 */
@Component({
  selector: 'sbb-table, table[sbb-table]',
  exportAs: 'sbbTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.css'],
  host: {
    class: 'sbb-table',
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
export class SbbTable<T> extends CdkTable<T> implements AfterViewInit {
  @ContentChildren(SbbHeaderCell, { descendants: true, read: ElementRef })
  headerElements: QueryList<ElementRef>;

  @ContentChildren(SbbCell, { descendants: true, read: ElementRef })
  rowElements: QueryList<ElementRef>;

  /** Overrides the sticky CSS class set by the `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected override stickyCssClass: string = 'sbb-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected override needsPositionStickyOnElement: boolean = false;

  ngAfterViewInit(): void {
    this.headerElements.changes.subscribe((value) => this._setGroupClasses(value));
    this.rowElements.changes.subscribe((value) => this._setGroupClasses(value));
  }

  // TODO: set class manually in template and remove code below @breaking-change
  private _setGroupClasses(elements: QueryList<ElementRef>) {
    if (
      this.dataSource instanceof SbbTableDataSource &&
      this.dataSource.groups &&
      elements.length
    ) {
      this.dataSource.groups.forEach((group) => {
        if (group.length > 1) {
          // remove right border from all cells except the last one, where the left one is removed
          group.forEach((name, index) => {
            const cells = elements.filter((item) =>
              item.nativeElement.classList.contains(`sbb-column-${name}`)
            );
            if (index !== group.length - 1) {
              cells.forEach((cell) => cell.nativeElement.classList.add('sbb-no-border-left'));
            }
          });
        }
      });
    }
  }
}
