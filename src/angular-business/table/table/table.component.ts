import { CdkTable, CDK_TABLE_TEMPLATE, DataSource } from '@angular/cdk/table';
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

import { CellDirective, HeaderCellDirective } from '../table-cell/table-cell.component';

import { SbbTableDataSource } from './table-data-source';

@Component({
  selector: 'sbb-table, table[sbbTable]',
  exportAs: 'sbbTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.component.css'],
  providers: [{ provide: CdkTable, useExisting: TableComponent }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TableComponent<T> extends CdkTable<T> implements AfterViewInit {
  @HostBinding('class.sbb-table') sbbTable = true;

  @ContentChildren(HeaderCellDirective, { descendants: true, read: ElementRef })
  headerElements: QueryList<ElementRef>;

  @ContentChildren(CellDirective, { descendants: true, read: ElementRef })
  rowElements: QueryList<ElementRef>;

  dataSource: DataSource<T>;

  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected _stickyCssClass = 'sbb-table-sticky';

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
