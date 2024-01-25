import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
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
  imports: [
    CdkScrollableModule,
    SbbCommonModule,
    SbbIconModule,
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
