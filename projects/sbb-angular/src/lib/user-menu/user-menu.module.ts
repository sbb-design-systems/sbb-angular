import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [
    CommonModule
  ],
  exports:[UserMenuComponent]
})
export class UserMenuModule { }
