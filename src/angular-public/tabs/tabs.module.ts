import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BadgeModule } from '@sbb-esta/angular-public/badge';

import { TabContent } from './tab/tab-content';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [CommonModule, BadgeModule, PortalModule],
  declarations: [TabComponent, TabsComponent, TabContent],
  exports: [TabComponent, TabsComponent, TabContent],
})
export class TabsModule {}
