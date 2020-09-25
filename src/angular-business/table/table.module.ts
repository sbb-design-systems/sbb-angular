import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbSortHeaderComponent } from './sort-header/sort-header.component';
import { SbbSortDirective } from './sort/sort.component';
import {
  SbbCell,
  SbbCellDef,
  SbbColumnDef,
  SbbFooterCell,
  SbbFooterCellDef,
  SbbHeaderCell,
  SbbHeaderCellDef,
} from './table-cell/table-cell.component';
import {
  SbbFooterRow,
  SbbFooterRowDef,
  SbbHeaderRow,
  SbbHeaderRowDef,
  SbbRow,
  SbbRowDef,
} from './table-row/table-row.component';
import { SbbTable } from './table/table.component';
import { SbbTextColumn } from './text-column/text-column.component';

@NgModule({
  imports: [CdkTableModule, CommonModule],
  declarations: [
    SbbTable,
    SbbTextColumn,
    SbbCell,
    SbbHeaderCell,
    SbbCellDef,
    SbbHeaderCellDef,
    SbbFooterCellDef,
    SbbFooterCell,
    SbbColumnDef,
    SbbHeaderRow,
    SbbFooterRow,
    SbbRow,
    SbbRowDef,
    SbbHeaderRowDef,
    SbbFooterRowDef,
    SbbSortDirective,
    SbbSortHeaderComponent,
  ],
  exports: [
    SbbTable,
    SbbTextColumn,
    SbbCell,
    SbbHeaderCell,
    SbbCellDef,
    SbbHeaderCellDef,
    SbbFooterCellDef,
    SbbFooterCell,
    SbbColumnDef,
    SbbHeaderRow,
    SbbFooterRow,
    SbbRow,
    SbbRowDef,
    SbbHeaderRowDef,
    SbbFooterRowDef,
    SbbSortDirective,
    SbbSortHeaderComponent,
  ],
})
export class SbbTableModule {}
