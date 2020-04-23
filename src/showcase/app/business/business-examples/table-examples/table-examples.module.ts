import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableModule } from '@sbb-esta/angular-business/table';

import { GroupedColumnsTableExampleComponent } from './grouped-columns-table-example/grouped-columns-table-example.component';
import { GroupedRowsTableExampleComponent } from './grouped-rows-table-example/grouped-rows-table-example.component';
import { SimpleTableExampleComponent } from './simple-table-example/simple-table-example.component';
import { SortableTableExampleComponent } from './sortable-table-example/sortable-table-example.component';

const EXAMPLES = [
  GroupedColumnsTableExampleComponent,
  GroupedRowsTableExampleComponent,
  SimpleTableExampleComponent,
  SortableTableExampleComponent
];

@NgModule({
  imports: [CommonModule, TableModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class TableExamplesModule {}
