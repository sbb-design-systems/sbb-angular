import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbContextmenuTrigger } from './contextmenu-trigger';
import { SbbMenu } from './menu';
import { SbbMenuContent } from './menu-content';
import { SbbMenuDynamicTrigger } from './menu-dynamic-trigger';
import { SbbMenuItem } from './menu-item';
import { SbbMenuTrigger, SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER } from './menu-trigger';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, SbbCommonModule, SbbIconModule],
  exports: [
    CdkScrollableModule,
    SbbMenu,
    SbbMenuItem,
    SbbMenuTrigger,
    SbbContextmenuTrigger,
    SbbMenuDynamicTrigger,
    SbbMenuContent,
  ],
  declarations: [
    SbbMenu,
    SbbMenuItem,
    SbbMenuTrigger,
    SbbContextmenuTrigger,
    SbbMenuDynamicTrigger,
    SbbMenuContent,
  ],
  providers: [SBB_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbMenuModule {}
