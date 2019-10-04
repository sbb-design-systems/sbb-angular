import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropdownModule } from '@sbb-esta/angular-business/dropdown';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import {
  IconChevronSmallDownModule,
  IconChevronSmallUpModule,
  IconCrossModule,
  IconHamburgerMenuModule
} from '@sbb-esta/angular-icons';

import { AppChooserSectionComponent } from './app-chooser-section/app-chooser-section.component';
import { HeaderComponent } from './header/header.component';
import { NavbuttonComponent } from './navbutton/navbutton.component';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    IconHamburgerMenuModule,
    IconCrossModule,
    IconChevronSmallDownModule,
    IconChevronSmallUpModule,
    DropdownModule,
    ScrollingModule
  ],
  declarations: [HeaderComponent, NavbuttonComponent, AppChooserSectionComponent],
  exports: [HeaderComponent, NavbuttonComponent, AppChooserSectionComponent, DropdownModule]
})
export class HeaderModule {}
