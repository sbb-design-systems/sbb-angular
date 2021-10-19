import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconDirectiveModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbUsermenu, SBB_USERMENU_SCROLL_STRATEGY_PROVIDER } from './usermenu';
import { SbbUsermenuItem } from './usermenu-item';

@NgModule({
  declarations: [SbbUsermenu, SbbUsermenuItem],
  imports: [CommonModule, SbbIconModule, OverlayModule, SbbIconDirectiveModule],
  exports: [SbbUsermenu, SbbUsermenuItem, SbbIconDirectiveModule],
  providers: [SBB_USERMENU_SCROLL_STRATEGY_PROVIDER],
})
export class SbbUsermenuModule {}
