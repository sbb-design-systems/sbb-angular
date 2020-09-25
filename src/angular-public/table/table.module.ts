import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbTable } from './table/table.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SbbTable],
  exports: [SbbTable],
})
export class SbbTableModule {}
