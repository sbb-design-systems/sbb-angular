import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbSortHeaderComponent } from './sort/sort-header/sort-header.component';
import { SbbSortDirective } from './sort/sort.component';
import {
  CellDefDirective,
  CellDirective,
  ColumnDefDirective,
  FooterCellDefDirective,
  FooterCellDirective,
  HeaderCellDefDirective,
  HeaderCellDirective
} from './table/table-cell/table-cell.component';
import {
  FooterRowComponent,
  FooterRowDefDirective,
  HeaderRowComponent,
  HeaderRowDefDirective,
  RowComponent,
  RowDefDirective
} from './table/table-row/table-row.component';
import { TableComponent } from './table/table.component';
import { TextColumnComponent } from './table/text-column/text-column.component';

const EXPORTED_DECLARATIONS = [
  TableComponent,
  TextColumnComponent,
  CellDirective,
  HeaderCellDirective,
  CellDefDirective,
  HeaderCellDefDirective,
  FooterCellDefDirective,
  FooterCellDirective,
  ColumnDefDirective,
  HeaderRowComponent,
  FooterRowComponent,
  RowComponent,
  RowDefDirective,
  HeaderRowDefDirective,
  FooterRowDefDirective,
  SbbSortDirective,
  SbbSortHeaderComponent
];

@NgModule({
  imports: [CdkTableModule, CommonModule],
  declarations: EXPORTED_DECLARATIONS,
  exports: EXPORTED_DECLARATIONS
})
export class TableModule {}
