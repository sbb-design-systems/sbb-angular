import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [BreadcrumbsComponent, BreadcrumbComponent],
  imports: [CommonModule, DropdownModule, LayoutModule, SbbIconModule],
  exports: [BreadcrumbsComponent, BreadcrumbComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class BreadcrumbModule {}
