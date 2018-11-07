import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabNewComponent } from './tab-new/tab-new.component';
import { TabsNewComponent } from './tabs-new/tabs-new.component';
import { TabBadgePillNewComponent } from './tab-badge-pill-new/tab-badge-pill-new.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';

@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
  ],
  declarations: [TabNewComponent, TabsNewComponent, TabBadgePillNewComponent],
  exports: [TabNewComponent, TabsNewComponent, TabBadgePillNewComponent]
})
export class TabsNewModule { }
