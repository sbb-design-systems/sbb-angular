import { CDK_TABLE_TEMPLATE, CdkTable } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sbb-table, table[sbbTable]',
  exportAs: 'sbbTable',
  template: CDK_TABLE_TEMPLATE,
  styleUrls: ['table.component.scss'],
  providers: [{ provide: CdkTable, useExisting: TableComponent }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class TableComponent<T> extends CdkTable<T> {
  static ngAcceptInputTypeMultiTemplateDataRows: boolean | string | null | undefined = undefined;

  @HostBinding('class.sbb-table') sbbTable = true;

  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected _stickyCssClass = 'sbb-table-sticky';
}
