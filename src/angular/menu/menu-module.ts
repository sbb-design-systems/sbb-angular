import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbMenu } from './menu';
import { SbbMenuContent } from './menu-content';
import { SbbMenuItem } from './menu-item';
import { SbbMenuTrigger, SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER } from './menu-trigger';

@NgModule({
  imports: [CommonModule, OverlayModule],
  exports: [CdkScrollableModule, SbbMenu, SbbMenuItem, SbbMenuTrigger, SbbMenuContent],
  declarations: [SbbMenu, SbbMenuItem, SbbMenuTrigger, SbbMenuContent],
  providers: [SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbMenuModule {}
