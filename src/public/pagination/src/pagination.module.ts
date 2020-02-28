import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconChevronSmallLeftModule, IconChevronSmallRightModule } from '@sbb-esta/angular-icons';

import { NavigationComponent } from './navigation/navigation.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [PaginationComponent, NavigationComponent],
  imports: [CommonModule, RouterModule, IconChevronSmallLeftModule, IconChevronSmallRightModule],
  exports: [PaginationComponent, NavigationComponent]
})
export class PaginationModule {}
