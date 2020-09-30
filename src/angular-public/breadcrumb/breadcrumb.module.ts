import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { SbbDropdownModule } from '@sbb-esta/angular-public/dropdown';

import { SbbBreadcrumb } from './breadcrumb/breadcrumb.component';
import { SbbBreadcrumbs } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [SbbBreadcrumbs, SbbBreadcrumb],
  imports: [CommonModule, SbbDropdownModule, LayoutModule, SbbIconModule],
  exports: [SbbBreadcrumbs, SbbBreadcrumb],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbBreadcrumbModule {}
