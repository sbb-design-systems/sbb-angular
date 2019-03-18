import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BadgeModule } from '../badge/badge';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    BadgeModule
  ],
  declarations: [TabComponent, TabsComponent],
  exports: [TabComponent, TabsComponent]
})
export class TabsModule { }
