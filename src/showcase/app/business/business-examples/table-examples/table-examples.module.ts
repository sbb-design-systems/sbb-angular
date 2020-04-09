import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from '@sbb-esta/angular-business/table';

import { GroupedColumnsTableComponent } from './grouped-columns-table/grouped-columns-table.component';
import { GroupedRowsTableComponent } from './grouped-rows-table/grouped-rows-table.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';
import { SortableTableComponent } from './sortable-table/sortable-table.component';

const EXAMPLES = [
  GroupedColumnsTableComponent,
  GroupedRowsTableComponent,
  SimpleTableComponent,
  SortableTableComponent
];

@NgModule({
  imports: [CommonModule, TableModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TableExamplesModule {}
