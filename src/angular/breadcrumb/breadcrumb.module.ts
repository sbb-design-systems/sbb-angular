import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';
import { SbbBreadcrumbRoot } from './breadcrumb-root';
import { SbbBreadcrumbs } from './breadcrumbs';

@NgModule({
  declarations: [SbbBreadcrumbs, SbbBreadcrumb, SbbBreadcrumbRoot],
  imports: [CommonModule, SbbMenuModule, SbbIconModule],
  exports: [SbbBreadcrumbs, SbbBreadcrumb, SbbBreadcrumbRoot],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbBreadcrumbModule {}
