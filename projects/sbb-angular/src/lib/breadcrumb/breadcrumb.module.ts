import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DropdownModule } from '../dropdown/dropdown';
import { BreadcrumbLevelDirective } from './breadcrumb-level.directive';
import { IconArrowLeftModule, IconArrowSmallDownModule } from '../svg-icons/svg-icons';

@NgModule({
  declarations: [BreadcrumbComponent, BreadcrumbLevelDirective],
  imports: [
    CommonModule,
    DropdownModule,
    IconArrowLeftModule,
    IconArrowSmallDownModule
  ],
  exports: [BreadcrumbComponent, BreadcrumbLevelDirective]
})
export class BreadcrumbModule { }
