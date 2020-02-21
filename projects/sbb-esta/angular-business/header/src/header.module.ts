import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  IconChevronSmallDownModule,
  IconChevronSmallLeftModule,
  IconChevronSmallUpModule,
  IconCrossModule,
  IconHamburgerMenuModule
} from '@sbb-esta/angular-icons';

import { AppChooserSectionComponent } from './app-chooser-section/app-chooser-section.component';
import { HeaderMenuItemDirective } from './header-menu-item/header-menu-item.directive';
import {
  HeaderMenuTriggerComponent,
  SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './header-menu-trigger/header-menu-trigger.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    IconHamburgerMenuModule,
    IconCrossModule,
    IconChevronSmallDownModule,
    IconChevronSmallLeftModule,
    IconChevronSmallUpModule
  ],
  declarations: [
    HeaderComponent,
    AppChooserSectionComponent,
    HeaderMenuComponent,
    HeaderMenuTriggerComponent,
    HeaderMenuItemDirective
  ],
  exports: [
    HeaderComponent,
    AppChooserSectionComponent,
    HeaderMenuComponent,
    HeaderMenuTriggerComponent,
    HeaderMenuItemDirective
  ],
  providers: [SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class HeaderModule {}
