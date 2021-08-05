import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbSortHeaderComponent } from './sort-header/sort-header';
import { SbbSortDirective } from './sort/sort';
import {
  SbbCell,
  SbbCellDef,
  SbbColumnDef,
  SbbFooterCell,
  SbbFooterCellDef,
  SbbHeaderCell,
  SbbHeaderCellDef,
} from './table-cell/table-cell';
import {
  SbbFooterRow,
  SbbFooterRowDef,
  SbbHeaderRow,
  SbbHeaderRowDef,
  SbbRow,
  SbbRowDef,
} from './table-row/table-row';
import { SbbTable } from './table/table';
import { SbbTextColumn } from './text-column/text-column';

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
