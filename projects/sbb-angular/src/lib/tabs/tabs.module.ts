import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TabComponent, TabsComponent],
  exports: [TabComponent, TabsComponent]
})
export class TabsModule { }
