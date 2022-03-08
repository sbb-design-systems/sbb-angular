import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';
import { SbbPaginationModule } from '@sbb-esta/angular/pagination';
import { SbbTableModule } from '@sbb-esta/angular/table';

import { SbbDataTableCellDirective } from './cell.directive';
import { SbbDataTableColumnComponent } from './column.component';
import { SbbDataTableComponent } from './data-table.component';
import { SbbDataTableFilterDirective } from './filter.directive';
import { SbbDataTableHeaderDirective } from './header.directive';
import { SbbDataTableRowGroupComponent } from './row-group.component';

@NgModule({
  declarations: [
    SbbDataTableComponent,
    SbbDataTableColumnComponent,
    SbbDataTableHeaderDirective,
    SbbDataTableFilterDirective,
    SbbDataTableCellDirective,
    SbbDataTableRowGroupComponent,
  ],
  imports: [CommonModule, SbbTableModule, SbbPaginationModule, SbbTableModule, SbbLoadingModule],
  exports: [
    SbbDataTableComponent,
    SbbDataTableColumnComponent,
    SbbDataTableHeaderDirective,
    SbbDataTableFilterDirective,
    SbbDataTableCellDirective,
    SbbDataTableRowGroupComponent,
  ],
})
export class SbbDataTableModule {}
