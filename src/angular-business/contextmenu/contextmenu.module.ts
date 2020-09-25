import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbDropdownModule } from '@sbb-esta/angular-business/dropdown';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbContextmenu } from './contextmenu/contextmenu.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, SbbDropdownModule],
  declarations: [SbbContextmenu],
  exports: [SbbContextmenu, SbbDropdownModule],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbContextmenuModule {}
