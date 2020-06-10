import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '@sbb-esta/angular-business/autocomplete';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';
import { SelectModule } from '@sbb-esta/angular-business/select';
import { TableModule } from '@sbb-esta/angular-business/table';

import { provideExamples } from '../../../shared/example-provider';

import { FilterSortPaginatorTableExampleComponent } from './filter-sort-paginator-table-example/filter-sort-paginator-table-example.component';
import { GroupedColumnsTableExampleComponent } from './grouped-columns-table-example/grouped-columns-table-example.component';
import { GroupedRowsAndColumnsTableExampleComponent } from './grouped-rows-and-columns-table-example/grouped-rows-and-columns-table-example.component';
import { PaginatorTableExampleComponent } from './paginator-table-example/paginator-table-example.component';
import { SelectableTableExampleComponent } from './selectable-table-example/selectable-table-example.component';
import { SimpleTableExampleComponent } from './simple-table-example/simple-table-example.component';
import { SortableTableExampleComponent } from './sortable-table-example/sortable-table-example.component';

const EXAMPLES = [
  FilterSortPaginatorTableExampleComponent,
  GroupedColumnsTableExampleComponent,
  GroupedRowsAndColumnsTableExampleComponent,
  PaginatorTableExampleComponent,
  SelectableTableExampleComponent,
  SimpleTableExampleComponent,
  SortableTableExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-table-example': SimpleTableExampleComponent,
  'grouped-columns-table-example': GroupedColumnsTableExampleComponent,
  'grouped-rows-and-columns-table-example': GroupedRowsAndColumnsTableExampleComponent,
  'sortable-table-example': SortableTableExampleComponent,
  'paginator-table-example': PaginatorTableExampleComponent,
  'selectable-table-example': SelectableTableExampleComponent,
  'filter-sort-paginator-table-example': FilterSortPaginatorTableExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteModule,
    CheckboxModule,
    FieldModule,
    PaginationModule,
    SelectModule,
    TableModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'table', EXAMPLE_INDEX)],
})
export class TableExamplesModule {}
