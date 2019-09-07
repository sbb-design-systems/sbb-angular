import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconChevronSmallDownModule, IconUserModule } from '@sbb-esta/angular-icons';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { UserMenuComponent } from './usermenu/usermenu.component';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [CommonModule, DropdownModule, IconChevronSmallDownModule, IconUserModule],
  exports: [UserMenuComponent, DropdownModule]
})
export class UserMenuModule {}
