import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  declarations: [PaginationComponent, NavigationComponent],
  imports: [
    CommonModule
  ],
  exports: [PaginationComponent, NavigationComponent]
})
export class PaginationModule { }
