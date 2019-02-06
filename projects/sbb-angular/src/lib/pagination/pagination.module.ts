import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NavigationComponent } from './navigation/navigation.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    PaginationComponent,
    NavigationComponent,
  ],
  imports: [
    CommonModule,
    IconCommonModule,
    RouterModule
  ],
  exports: [
    PaginationComponent,
    NavigationComponent,
  ]
})
export class PaginationModule { }
