import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { ScrollAreaDirective } from './table/table-scroll-area.directive';

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
