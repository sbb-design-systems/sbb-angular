import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ScrollAreaDirective } from './table/table-scroll-area.directive';
import { TableComponent } from './table/table.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    ScrollAreaDirective
  ],
  exports: [
    TableComponent,
    ScrollAreaDirective
  ]
})
export class TableModule { }
