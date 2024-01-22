import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNavigation } from './navigation/navigation';
import { SbbPaginator } from './paginator/paginator';

@NgModule({
  declarations: [SbbNavigation, SbbPaginator],
  imports: [RouterModule, SbbCommonModule, SbbIconModule],
  exports: [SbbNavigation, SbbPaginator],
})
export class SbbPaginationModule {}
