import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbDataTableModule } from '@sbb-esta/angular-experimental/data-table';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

import { DataTableBasicExample } from './data-table-basic/data-table-basic-example';
import { DataTableFormattingExample } from './data-table-formatting/data-table-formatting-example';
import { DataTablePagingExample } from './data-table-paging/data-table-paging-example';
import { DataTableSortingFilteringExample } from './data-table-sorting-filtering/data-table-sorting-filtering-example';

export {
  DataTableBasicExample,
  DataTablePagingExample,
  DataTableFormattingExample,
  DataTableSortingFilteringExample,
};

const EXAMPLES = [
  DataTableBasicExample,
  DataTablePagingExample,
  DataTableFormattingExample,
  DataTableSortingFilteringExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbDataTableModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class DataTableExamplesModule {}
