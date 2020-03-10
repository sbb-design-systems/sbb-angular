import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableComponent } from './table/table.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class TableModule {}
