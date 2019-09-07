import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BadgeModule } from '@sbb-esta/angular-public/badge';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [CommonModule, PerfectScrollbarModule, BadgeModule],
  declarations: [TabComponent, TabsComponent],
  exports: [TabComponent, TabsComponent]
})
export class TabsModule {}
