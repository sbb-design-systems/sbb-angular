import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconChevronSmallDownModule } from '@sbb-esta/angular-icons/arrow';
import { IconUserModule } from '@sbb-esta/angular-icons/user';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { UserMenuComponent } from './usermenu/usermenu.component';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [CommonModule, DropdownModule, IconChevronSmallDownModule, IconUserModule],
  exports: [UserMenuComponent, DropdownModule]
})
export class UserMenuModule {}
