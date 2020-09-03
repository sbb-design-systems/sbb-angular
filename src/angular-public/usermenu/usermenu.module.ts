import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';

import { UserMenuComponent } from './usermenu/usermenu.component';

@NgModule({
  declarations: [UserMenuComponent],
  imports: [CommonModule, DropdownModule, SbbIconModule],
  exports: [UserMenuComponent, DropdownModule],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class UsermenuModule {}
