import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconsRoutingModule } from '@sbb-esta/angular-icons-routing.module';
import { IconsComponent } from '@sbb-esta/angular-icons/icons.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [IconsComponent],
  imports: [CommonModule, SharedModule, IconsRoutingModule]
})
export class IconsModule {}
