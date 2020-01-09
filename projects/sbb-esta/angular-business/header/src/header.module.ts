import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
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
import { NavbuttonComponent } from './navbutton/navbutton.component';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    IconHamburgerMenuModule,
    IconCrossModule,
    IconChevronSmallDownModule,
    IconChevronSmallLeftModule,
    IconChevronSmallUpModule,
    DropdownModule,
    ScrollingModule
  ],
  declarations: [
    HeaderComponent,
    NavbuttonComponent,
    AppChooserSectionComponent,
    HeaderMenuComponent,
    HeaderMenuTriggerComponent,
    HeaderMenuItemDirective
  ],
  exports: [
    HeaderComponent,
    NavbuttonComponent,
    AppChooserSectionComponent,
    HeaderMenuComponent,
    HeaderMenuTriggerComponent,
    HeaderMenuItemDirective,
    DropdownModule
  ],
  providers: [SBB_HEADER_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class HeaderModule {}
