import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabBadgePillComponent } from './tab-badge-pill/tab-badge-pill.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule,
    PerfectScrollbarModule
  ],
  declarations: [TabComponent, TabsComponent, TabBadgePillComponent],
  exports: [TabComponent, TabsComponent, TabBadgePillComponent]
})
export class TabsModule { }
