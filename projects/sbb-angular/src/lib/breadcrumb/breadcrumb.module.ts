import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DropdownModule } from '../dropdown/dropdown';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [
    CommonModule,
    DropdownModule
  ],
  exports: [BreadcrumbComponent]
})
export class BreadcrumbModule { }
