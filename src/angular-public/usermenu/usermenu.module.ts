import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbUsermenuItem } from './usermenu-item/usermenu-item';
import { SbbUserMenu, SBB_USERMENU_SCROLL_STRATEGY_PROVIDER } from './usermenu/usermenu.component';

@NgModule({
  declarations: [SbbUserMenu, SbbUsermenuItem],
  imports: [CommonModule, SbbIconModule, OverlayModule],
  exports: [SbbUserMenu, SbbUsermenuItem],
  providers: [SBB_USERMENU_SCROLL_STRATEGY_PROVIDER, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbUsermenuModule {}
