import { _DisposeViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import {
  CdkTable,
  CDK_TABLE,
  CDK_TABLE_TEMPLATE,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
} from '@angular/cdk/table';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';

import { SbbCell, SbbHeaderCell } from '../table-cell/table-cell.component';

import { SbbTableDataSource } from './table-data-source';

@Component({
  selector: 'sbb-table, table[sbbTable]',
  exportAs: 'sbbTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.component.css'],
  providers: [
    // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
    //  is only included in the build if used.
    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
    { provide: CdkTable, useExisting: SbbTable },
    { provide: CDK_TABLE, useExisting: SbbTable },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
  ],
  // The "OnPush" status for the `SbbTable` component is effectively a noop, so we are removing it.
  // The view for `SbbTable` consists entirely of templates declared in other views. As they are
  // declared elsewhere, they are checked when their declaration points are checked.
  // tslint:disable-next-line:validate-decorators
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SbbTable<T> extends CdkTable<T> implements AfterViewInit {
  @HostBinding('class.sbb-table') sbbTable = true;

  @ContentChildren(SbbHeaderCell, { descendants: true, read: ElementRef })
  headerElements: QueryList<ElementRef>;

  @ContentChildren(SbbCell, { descendants: true, read: ElementRef })
  rowElements: QueryList<ElementRef>;

  /** Overrides the sticky CSS class set by the `CdkTable`. */
  // tslint:disable-next-line:naming-convention
  protected stickyCssClass = 'sbb-table-sticky';

  /**
   * @deprecated use stickyCssClass
   */
  protected _stickyCssClass = this.stickyCssClass;

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
