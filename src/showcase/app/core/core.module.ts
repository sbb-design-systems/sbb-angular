import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core/core.component';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    TabsModule,
    CoreRoutingModule
  ]
})
export class CoreModule {}
