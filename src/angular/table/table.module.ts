import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbSort } from './sort/sort';
import { SbbSortHeader } from './sort/sort-header';
import {
  SbbCell,
  SbbCellDef,
  SbbColumnDef,
  SbbFooterCell,
  SbbFooterCellDef,
  SbbHeaderCell,
  SbbHeaderCellDef,
} from './table/cell';
import {
  SbbFooterRow,
  SbbFooterRowDef,
  SbbHeaderRow,
  SbbHeaderRowDef,
  SbbRow,
  SbbRowDef,
} from './table/row';
import { SbbRecycleRows, SbbTable } from './table/table';
import { SbbTableWrapper } from './table/table-wrapper';
import { SbbTextColumn } from './table/text-column';

const EXPORTED_DECLARATIONS = [
  // Table
  SbbTable,
  SbbRecycleRows,
  SbbTableWrapper,

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
  imports: [CdkTableModule, SbbCommonModule, ...EXPORTED_DECLARATIONS],
  exports: EXPORTED_DECLARATIONS,
})
export class SbbTableModule {}
