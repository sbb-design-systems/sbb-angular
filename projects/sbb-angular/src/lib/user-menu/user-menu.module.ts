import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { DropdownModule } from '../dropdown/dropdown';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [
    CommonModule, DropdownModule
  ],
  exports: [UserMenuComponent, DropdownModule]
})
export class UserMenuModule { }
