import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbAppChooserSection } from './app-chooser-section/app-chooser-section.component';
import { SbbHeaderMenuItem } from './header-menu-item/header-menu-item.directive';
import {
  SbbHeaderMenuTrigger,
  SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './header-menu-trigger/header-menu-trigger.component';
import { SbbHeaderMenu } from './header-menu/header-menu.component';
import { SbbHeader } from './header/header.component';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule, SbbIconModule],
  declarations: [
    SbbHeader,
    SbbAppChooserSection,
    SbbHeaderMenu,
    SbbHeaderMenuTrigger,
    SbbHeaderMenuItem,
  ],
  exports: [
    SbbHeader,
    SbbAppChooserSection,
    SbbHeaderMenu,
    SbbHeaderMenuTrigger,
    SbbHeaderMenuItem,
  ],
  providers: [
    SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER,
    ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER,
  ],
})
export class SbbHeaderModule {}
