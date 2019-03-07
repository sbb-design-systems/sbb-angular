import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DropdownModule } from '../dropdown/dropdown';
import { IconArrowLeftModule, IconArrowSmallDownModule } from '../svg-icons/svg-icons';
import { BreadcrumbLevelComponent } from './breadcrumb-level/breadcrumb-level.component';

@NgModule({
  declarations: [BreadcrumbComponent, BreadcrumbLevelComponent],
  imports: [
    CommonModule,
    DropdownModule,
    IconArrowLeftModule,
    IconArrowSmallDownModule
  ],
  exports: [BreadcrumbComponent, BreadcrumbLevelComponent]
})
export class BreadcrumbModule { }
