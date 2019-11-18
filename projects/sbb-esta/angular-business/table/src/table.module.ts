import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';

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
  FooterRowDefDirective
];

@NgModule({
  imports: [CdkTableModule],
  declarations: EXPORTED_DECLARATIONS,
  exports: EXPORTED_DECLARATIONS
})
export class TableModule {}
