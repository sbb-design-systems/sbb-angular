import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbSortHeaderComponent } from './sort-header/sort-header.component';
import { SbbSortDirective } from './sort/sort.component';
import {
  CellDefDirective,
  CellDirective,
  ColumnDefDirective,
  FooterCellDefDirective,
  FooterCellDirective,
  HeaderCellDefDirective,
  HeaderCellDirective,
} from './table-cell/table-cell.component';
import {
  FooterRowComponent,
  FooterRowDefDirective,
  HeaderRowComponent,
  HeaderRowDefDirective,
  RowComponent,
  RowDefDirective,
} from './table-row/table-row.component';
import { TableComponent } from './table/table.component';
import { TextColumnComponent } from './text-column/text-column.component';

@NgModule({
  imports: [CdkTableModule, CommonModule],
  declarations: [
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
    SbbSortHeaderComponent,
  ],
  exports: [
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
    SbbSortHeaderComponent,
  ],
})
export class TableModule {}
