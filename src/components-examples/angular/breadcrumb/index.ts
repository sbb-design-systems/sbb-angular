import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbBreadcrumbModule } from '@sbb-esta/angular/breadcrumb';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { BreadcrumbCustomRootExample } from './breadcrumb-custom-root/breadcrumb-custom-root-example';
import { BreadcrumbDynamicExample } from './breadcrumb-dynamic/breadcrumb-dynamic-example';
import { BreadcrumbMenuExample } from './breadcrumb-menu/breadcrumb-menu-example';
import { BreadcrumbExample } from './breadcrumb/breadcrumb-example';

export {
  BreadcrumbExample,
  BreadcrumbMenuExample,
  BreadcrumbDynamicExample,
  BreadcrumbCustomRootExample,
};

const EXAMPLES = [
  BreadcrumbExample,
  BreadcrumbMenuExample,
  BreadcrumbDynamicExample,
  BreadcrumbCustomRootExample,
];

@NgModule({
  imports: [CommonModule, RouterModule, SbbIconModule, SbbBreadcrumbModule, SbbMenuModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class BreadcrumbExamplesModule {}
