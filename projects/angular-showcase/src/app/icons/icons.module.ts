import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons/icons.component';

@NgModule({
  declarations: [IconsComponent],
  imports: [CommonModule, SharedModule, IconsRoutingModule]
})
export class IconsModule {}
