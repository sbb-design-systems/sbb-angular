import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbNavigation } from './navigation/navigation.component';
import { SbbPagination } from './pagination/pagination.component';
import { SbbPaginatorComponent } from './paginator/paginator.component';

@NgModule({
  declarations: [SbbPagination, SbbNavigation, SbbPaginatorComponent],
  imports: [CommonModule, RouterModule, SbbIconModule],
  exports: [SbbPagination, SbbNavigation, SbbPaginatorComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbPaginationModule {}
