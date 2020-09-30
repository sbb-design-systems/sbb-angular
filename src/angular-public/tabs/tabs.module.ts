import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular-public/badge';

import { SbbTabContent } from './tab/tab-content';
import { SbbTab } from './tab/tab.component';
import { SbbTabs } from './tabs/tabs.component';

@NgModule({
  imports: [CommonModule, SbbBadgeModule, PortalModule],
  declarations: [SbbTab, SbbTabs, SbbTabContent],
  exports: [SbbTab, SbbTabs, SbbTabContent],
})
export class SbbTabsModule {}
