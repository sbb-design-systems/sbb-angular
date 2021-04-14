import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';
import { SbbBreadcrumbs } from './breadcrumbs';

@NgModule({
  declarations: [SbbBreadcrumbs, SbbBreadcrumb],
  imports: [CommonModule, SbbMenuModule, LayoutModule, SbbIconModule],
  exports: [SbbBreadcrumbs, SbbBreadcrumb],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbBreadcrumbModule {}
