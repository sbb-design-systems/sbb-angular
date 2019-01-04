import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TableCaptionDirective } from './table/table-caption.directive';
import { ScrollAreaDirective } from './table/table-scroll-area.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    TableCaptionDirective,
    ScrollAreaDirective
  ],
  exports: [
    TableComponent,
    TableCaptionDirective,
    ScrollAreaDirective
  ]
})
export class TableModule { }
