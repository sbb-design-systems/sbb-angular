import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { SbbDropdownModule } from '@sbb-esta/angular-public/dropdown';

import { SbbUserMenu } from './usermenu/usermenu.component';

@NgModule({
  declarations: [SbbUserMenu],
  imports: [CommonModule, SbbDropdownModule, SbbIconModule],
  exports: [SbbUserMenu, SbbDropdownModule],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbUsermenuModule {}
