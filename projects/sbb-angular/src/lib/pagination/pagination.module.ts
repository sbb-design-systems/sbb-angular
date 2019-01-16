import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NavigationComponent } from './navigation/navigation.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { PaginationItemComponent } from './pagination-item/pagination-item.component';

@NgModule({
  declarations: [
    PaginationComponent,
    NavigationComponent,
    PaginationItemComponent
  ],
  imports: [
    CommonModule,
    IconCommonModule
  ],
  exports: [
    PaginationComponent,
    NavigationComponent,
    PaginationItemComponent
  ]
})
export class PaginationModule { }
