import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  SbbIconSidebar,
  SbbIconSidebarContainer,
  SbbIconSidebarContent,
} from './icon-sidebar/icon-sidebar';
import { SbbDrawer, SbbDrawerContainer, SbbDrawerContent } from './sidebar-original/drawer';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from './sidebar-original/sidebar';

@NgModule({
  imports: [CommonModule, PlatformModule, CdkScrollableModule],
  exports: [
    CdkScrollableModule,

    SbbDrawer,
    SbbDrawerContainer,
    SbbDrawerContent,

    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,

    SbbIconSidebar,
    SbbIconSidebarContainer,
    SbbIconSidebarContent,
  ],
  declarations: [
    SbbDrawer,
    SbbDrawerContainer,
    SbbDrawerContent,

    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,

    SbbIconSidebar,
    SbbIconSidebarContainer,
    SbbIconSidebarContent,
  ],
})
export class SbbSidebarModule {}
