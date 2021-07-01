import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNavigation } from './navigation/navigation';
import { SbbPaginator } from './paginator/paginator';

@NgModule({
  declarations: [SbbNavigation, SbbPaginator],
  imports: [CommonModule, RouterModule, SbbIconModule],
  exports: [SbbNavigation, SbbPaginator],
})
export class SbbPaginationModule {}
