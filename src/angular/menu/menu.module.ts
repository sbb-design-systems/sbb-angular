import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
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
  imports: [
    OverlayModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
    SbbMenu,
    SbbMenuItem,
    SbbMenuTrigger,
    SbbContextmenuTrigger,
    SbbMenuDynamicTrigger,
    SbbMenuContent,
  ],
  exports: [
    CdkScrollableModule,
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
