import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconChevronRightModule, IconChevronSmallDownModule } from '@sbb-esta/angular-icons';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [BreadcrumbsComponent, BreadcrumbComponent],
  imports: [
    CommonModule,
    DropdownModule,
    LayoutModule,
    IconChevronRightModule,
    IconChevronSmallDownModule
  ],
  exports: [BreadcrumbsComponent, BreadcrumbComponent]
})
export class BreadcrumbModule {}
