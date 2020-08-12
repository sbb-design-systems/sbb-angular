import { PlatformModule } from '@angular/cdk/platform';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbDrawer, SbbDrawerContainer, SbbDrawerContent } from './drawer';
import { SbbSidebar, SbbSidebarContainer, SbbSidebarContent } from './sidebar';

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
  ],
  declarations: [
    SbbDrawer,
    SbbDrawerContainer,
    SbbDrawerContent,
    SbbSidebar,
    SbbSidebarContainer,
    SbbSidebarContent,
  ],
})
export class SbbSidebarModule {}
