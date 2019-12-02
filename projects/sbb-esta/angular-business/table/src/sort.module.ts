import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SBB_SORT_HEADER_INTL_PROVIDER } from './sort/sort-header/sort-header-intl';
import { SbbSortHeaderComponent } from './sort/sort-header/sort-header.component';
import { SbbSortDirective } from './sort/sort.component';

@NgModule({
  imports: [CommonModule],
  exports: [SbbSortDirective, SbbSortHeaderComponent],
  declarations: [SbbSortDirective, SbbSortHeaderComponent],
  providers: [SBB_SORT_HEADER_INTL_PROVIDER]
})
export class SbbSortModule {}
