import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import {
  SbbIconSidebar,
  SbbIconSidebarContainer,
  SbbIconSidebarContent,
} from './icon-sidebar/icon-sidebar';
import { SbbIconSidebarItem } from './icon-sidebar/icon-sidebar-item';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from './sidebar/sidebar';
import { SbbSidebarLink } from './sidebar/sidebar-link';

@NgModule({
  imports: [CommonModule, PlatformModule, CdkScrollableModule, SbbIconModule],
  declarations: [
    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,
    SbbSidebarLink,

    SbbIconSidebar,
    SbbIconSidebarContainer,
    SbbIconSidebarContent,
    SbbIconSidebarItem,
  ],
  exports: [
    CdkScrollableModule,

    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,
    SbbSidebarLink,

    SbbIconSidebar,
    SbbIconSidebarContainer,
    SbbIconSidebarContent,
    SbbIconSidebarItem,
  ],
})
export class SbbSidebarModule {}
