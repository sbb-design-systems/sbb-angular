import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './usermenu/usermenu.component';
import { DropdownModule } from '../dropdown/dropdown';
import { IconChevronSmallDownModule, IconUserModule } from 'sbb-angular-icons';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [
    CommonModule, DropdownModule, IconChevronSmallDownModule, IconUserModule
  ],
  exports: [UserMenuComponent, DropdownModule]
})
export class UserMenuModule { }
