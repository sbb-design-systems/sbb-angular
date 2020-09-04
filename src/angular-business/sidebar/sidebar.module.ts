import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import {
  SbbIconSidebar,
  SbbIconSidebarContainer,
  SbbIconSidebarContent,
  SBB_ICON_SIDEBAR_EXPANDED_DEFAULT_WIDTH,
  SBB_ICON_SIDEBAR_EXPANDED_WIDTH,
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
  providers: [
    {
      provide: SBB_ICON_SIDEBAR_EXPANDED_WIDTH,
      useValue: SBB_ICON_SIDEBAR_EXPANDED_DEFAULT_WIDTH,
    },
    ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER,
  ],
})
export class SbbSidebarModule {}
