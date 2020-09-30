import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';

import { SharedModule } from '../shared/shared.module';

import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons/icons.component';

@NgModule({
  declarations: [IconsComponent],
  imports: [CommonModule, SharedModule, IconsRoutingModule, SbbSidebarModule, SbbAccordionModule],
})
export class IconsModule {}
