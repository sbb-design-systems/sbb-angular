import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TableCaptionDirective } from './table/table-caption.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TableComponent,
    TableCaptionDirective
  ],
  exports: [
    TableComponent,
    TableCaptionDirective
  ]
})
export class TableModule { }
