import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';
import { TableModule } from '@sbb-esta/angular-business/table';

import { AdvancedTableExampleComponent } from './advanced-table-example/advanced-table-example.component';
import { GroupedColumnsTableExampleComponent } from './grouped-columns-table-example/grouped-columns-table-example.component';
import { GroupedRowsAndColumnsTableExampleComponent } from './grouped-rows-and-columns-table-example/grouped-rows-and-columns-table-example.component';
import { PaginationTableExampleComponent } from './pagination-table-example/pagination-table-example.component';
import { SimpleTableExampleComponent } from './simple-table-example/simple-table-example.component';
import { SortableTableExampleComponent } from './sortable-table-example/sortable-table-example.component';

const EXAMPLES = [
  GroupedColumnsTableExampleComponent,
  GroupedRowsAndColumnsTableExampleComponent,
  SimpleTableExampleComponent,
  SortableTableExampleComponent,
  PaginationTableExampleComponent,
  AdvancedTableExampleComponent
];

@NgModule({
  imports: [CommonModule, TableModule, PaginationModule, FormsModule, FieldModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TableExamplesModule {}
