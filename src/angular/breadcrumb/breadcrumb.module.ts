import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';
import { SbbBreadcrumbRoot } from './breadcrumb-root';
import { SbbBreadcrumbs } from './breadcrumbs';

@NgModule({
  declarations: [SbbBreadcrumbs, SbbBreadcrumb, SbbBreadcrumbRoot],
  imports: [SbbCommonModule, SbbMenuModule, SbbIconModule],
  exports: [SbbBreadcrumbs, SbbBreadcrumb, SbbBreadcrumbRoot],
})
export class SbbBreadcrumbModule {}
