import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconChevronSmallLeftCircleModule } from '@sbb-esta/angular-icons/arrow';

import {
  SbbIconSidebar,
  SbbIconSidebarContainer,
  SbbIconSidebarContent,
  SBB_ICON_SIDEBAR_EXPANDED_DEFAULT_WIDTH,
  SBB_ICON_SIDEBAR_EXPANDED_WIDTH,
} from './icon-sidebar/icon-sidebar';
import { SbbIconSidebarItem } from './icon-sidebar/icon-sidebar-item';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from './sidebar/sidebar';

@NgModule({
  imports: [CommonModule, PlatformModule, CdkScrollableModule, IconChevronSmallLeftCircleModule],
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
  providers: [
    {
      provide: SBB_ICON_SIDEBAR_EXPANDED_WIDTH,
      useValue: SBB_ICON_SIDEBAR_EXPANDED_DEFAULT_WIDTH,
    },
  ],
})
export class SbbSidebarModule {}
