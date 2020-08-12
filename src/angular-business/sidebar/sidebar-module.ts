import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  SbbIconSidebar,
  SbbIconSidebarContainer,
  SbbIconSidebarContent,
} from './icon-sidebar/icon-sidebar';
import { SbbIconSidebarItem } from './icon-sidebar/icon-sidebar-item';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from './sidebar/sidebar';

@NgModule({
  imports: [CommonModule, PlatformModule, CdkScrollableModule],
  exports: [
    CdkScrollableModule,

    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,

    SbbIconSidebar,
    SbbIconSidebarContainer,
    SbbIconSidebarContent,
    SbbIconSidebarItem,
  ],
  declarations: [
    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,

    SbbIconSidebar,
    SbbIconSidebarContainer,
    SbbIconSidebarContent,
    SbbIconSidebarItem,
  ],
})
export class SbbSidebarModule {}
