import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbEsriConfigModule } from '@sbb-esta/angular-maps/esri-config';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { MapsRoutingModule } from './maps-routing.module';

@NgModule({
  imports: [
    SbbEsriConfigModule.forRoot(),
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    MapsRoutingModule,
  ],
})
export class MapsModule {}
