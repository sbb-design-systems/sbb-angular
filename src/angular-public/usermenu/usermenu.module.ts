import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { UserMenuComponent } from './usermenu/usermenu.component';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [CommonModule, DropdownModule, SbbIconModule],
  exports: [UserMenuComponent, DropdownModule],
})
export class UsermenuModule {}
