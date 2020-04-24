import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';
import { TableModule } from '@sbb-esta/angular-business/table';

import { GroupedColumnsTableExampleComponent } from './grouped-columns-table-example/grouped-columns-table-example.component';
import { GroupedRowsTableExampleComponent } from './grouped-rows-table-example/grouped-rows-table-example.component';
import { SimpleTableExampleComponent } from './simple-table-example/simple-table-example.component';
import { SortableTableExampleComponent } from './sortable-table-example/sortable-table-example.component';
import { TablePaginationExampleComponent } from './table-pagination-example/table-pagination-example.component';

const EXAMPLES = [
  GroupedColumnsTableExampleComponent,
  GroupedRowsTableExampleComponent,
  SimpleTableExampleComponent,
  SortableTableExampleComponent,
  TablePaginationExampleComponent
];

@NgModule({
  imports: [CommonModule, TableModule, PaginationModule, FormsModule, FieldModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TableExamplesModule {}
