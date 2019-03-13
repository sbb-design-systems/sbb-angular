import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { DropdownModule } from '../dropdown/dropdown';
import { IconArrowLeftModule, IconArrowSmallDownModule } from '../svg-icons/svg-icons';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [BreadcrumbsComponent, BreadcrumbComponent],
  imports: [
    CommonModule,
    DropdownModule,
    LayoutModule,
    IconArrowLeftModule,
    IconArrowSmallDownModule
  ],
  exports: [BreadcrumbsComponent, BreadcrumbComponent]
})
export class BreadcrumbModule { }
