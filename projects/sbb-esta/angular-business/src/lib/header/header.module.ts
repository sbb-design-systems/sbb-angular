import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  IconChevronSmallDownModule,
  IconChevronSmallUpModule,
  IconHamburgerMenuModule
} from '@sbb-esta/angular-icons';

import { HeaderComponent } from './header/header.component';
import { NavbuttonComponent } from './navbutton/navbutton.component';

@NgModule({
  imports: [
    CommonModule,
    IconHamburgerMenuModule,
    IconChevronSmallDownModule,
    IconChevronSmallUpModule
  ],
  declarations: [HeaderComponent, NavbuttonComponent],
  exports: [HeaderComponent],
  entryComponents: [NavbuttonComponent]
})
export class HeaderModule {}
