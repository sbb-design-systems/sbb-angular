import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { SharedModule } from '../shared/shared.module';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core/core.component';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    PortalModule,
    SharedModule,
    TabsModule,
    CoreRoutingModule
  ]
})
export class CoreModule {}
