import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  IconChevronSmallDownModule,
  IconChevronSmallUpModule,
  IconHamburgerMenuModule
} from '@sbb-esta/angular-icons';
import { DropdownModule } from '@sbb-esta/angular-public';

import { HeaderComponent } from './header/header.component';
import { NavbuttonComponent } from './navbutton/navbutton.component';

@NgModule({
  imports: [
    CommonModule,
    IconHamburgerMenuModule,
    IconChevronSmallDownModule,
    IconChevronSmallUpModule,
    DropdownModule
  ],
  declarations: [HeaderComponent, NavbuttonComponent],
  exports: [HeaderComponent, NavbuttonComponent]
})
export class HeaderModule {}
