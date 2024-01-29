import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNavigation } from './navigation/navigation';
import { SbbPaginator } from './paginator/paginator';

@NgModule({
  imports: [RouterModule, SbbCommonModule, SbbIconModule, SbbNavigation, SbbPaginator],
  exports: [SbbNavigation, SbbPaginator],
})
export class SbbPaginationModule {}
