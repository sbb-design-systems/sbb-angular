import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { BadgeModule } from '@sbb-esta/angular-public/badge';

import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [CommonModule, ScrollingModule, BadgeModule],
  declarations: [TabComponent, TabsComponent],
  exports: [TabComponent, TabsComponent]
})
export class TabsModule {}
