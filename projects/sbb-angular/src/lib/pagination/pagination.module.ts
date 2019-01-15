import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PageNumberComponent } from './page-number/page-number.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';

@NgModule({
  declarations: [
    PaginationComponent,
    NavigationComponent,
    PageNumberComponent
  ],
  imports: [
    CommonModule,
    IconCommonModule
  ],
  exports: [
    PaginationComponent,
    NavigationComponent,
    PageNumberComponent
  ]
})
export class PaginationModule { }
