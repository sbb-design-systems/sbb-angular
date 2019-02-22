import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './usermenu/usermenu.component';
import { DropdownModule } from '../dropdown/dropdown';
import { IconArrowSmallDownModule, IconUserModule } from '../svg-icons/svg-icons';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [
    CommonModule, DropdownModule,IconArrowSmallDownModule,IconUserModule
  ],
  exports: [UserMenuComponent,DropdownModule]
})
export class UserMenuModule { }
