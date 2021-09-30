import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbTableModule } from '@sbb-esta/angular/table';

import { FilterSortPaginatorTableExample } from './filter-sort-paginator-table/filter-sort-paginator-table-example';
import { GroupedColumnsTableExample } from './grouped-columns-table/grouped-columns-table-example';
import { GroupedRowsAndColumnsTableExample } from './grouped-rows-and-columns-table/grouped-rows-and-columns-table-example';
import { PaginatorTableExample } from './paginator-table/paginator-table-example';
import { SelectableTableExample } from './selectable-table/selectable-table-example';
import { SimpleTableExample } from './simple-table/simple-table-example';
import { SortableTableExample } from './sortable-table/sortable-table-example';
import { StickyTableExample } from './sticky-table/sticky-table-example';
import { TableExample } from './table/table-example';

export {
  FilterSortPaginatorTableExample,
  GroupedColumnsTableExample,
  GroupedRowsAndColumnsTableExample,
  PaginatorTableExample,
  SelectableTableExample,
  SimpleTableExample,
  SortableTableExample,
  TableExample,
  StickyTableExample,
};

const EXAMPLES = [
  FilterSortPaginatorTableExample,
  GroupedColumnsTableExample,
  GroupedRowsAndColumnsTableExample,
  PaginatorTableExample,
  SelectableTableExample,
  SimpleTableExample,
  SortableTableExample,
  TableExample,
  StickyTableExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbInputModule,
    SbbRadioButtonModule,
    SbbTableModule,
    SbbPaginationModule,
    SbbAutocompleteModule,
    SbbSelectModule,
    SbbLoadingModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TableExamplesModule {}
