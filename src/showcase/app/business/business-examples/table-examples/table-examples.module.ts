import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';
import { TableModule } from '@sbb-esta/angular-business/table';

import { FilterSortPaginatorTableExampleComponent } from './filter-sort-paginator-table-example/filter-sort-paginator-table-example.component';
import { GroupedColumnsTableExampleComponent } from './grouped-columns-table-example/grouped-columns-table-example.component';
import { GroupedRowsAndColumnsTableExampleComponent } from './grouped-rows-and-columns-table-example/grouped-rows-and-columns-table-example.component';
import { PaginatorTableExampleComponent } from './paginator-table-example/paginator-table-example.component';
import { SimpleTableExampleComponent } from './simple-table-example/simple-table-example.component';
import { SortableTableExampleComponent } from './sortable-table-example/sortable-table-example.component';

const EXAMPLES = [
  GroupedColumnsTableExampleComponent,
  GroupedRowsAndColumnsTableExampleComponent,
  SimpleTableExampleComponent,
  SortableTableExampleComponent,
  PaginatorTableExampleComponent,
  FilterSortPaginatorTableExampleComponent
];

@NgModule({
  imports: [CommonModule, TableModule, PaginationModule, FormsModule, FieldModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TableExamplesModule {}
