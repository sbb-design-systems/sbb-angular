import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbSortHeader } from './sort-header/sort-header';
import { SbbSort } from './sort/sort';
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
import { SbbRecycleRows, SbbTable } from './table/table';
import { SbbTextColumn } from './text-column/text-column';

const EXPORTED_DECLARATIONS = [
  // Table
  SbbTable,
  SbbRecycleRows,

  // Template defs
  SbbHeaderCellDef,
  SbbHeaderRowDef,
  SbbColumnDef,
  SbbCellDef,
  SbbRowDef,
  SbbFooterCellDef,
  SbbFooterRowDef,

  // Cell directives
  SbbHeaderCell,
  SbbCell,
  SbbFooterCell,

  // Row directives
  SbbHeaderRow,
  SbbRow,
  SbbFooterRow,

  SbbTextColumn,

  // Sort
  SbbSort,
  SbbSortHeader,
];

@NgModule({
  imports: [CdkTableModule, CommonModule],
  declarations: EXPORTED_DECLARATIONS,
  exports: EXPORTED_DECLARATIONS,
})
export class SbbTableModule {}
