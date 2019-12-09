import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbSortHeaderComponent } from './sort/sort-header/sort-header.component';
import { SbbSortDirective } from './sort/sort.component';

@NgModule({
  imports: [CommonModule],
  exports: [SbbSortDirective, SbbSortHeaderComponent],
  declarations: [SbbSortDirective, SbbSortHeaderComponent]
})
export class SbbSortModule {}
