import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { MapsLeafletExamplesModule } from './maps-leaflet-examples/maps-leaflet-examples.module';
import { MapsLeafletRoutingModule } from './maps-leaflet-routing.module';
import { MapsLeafletComponent } from './maps-leaflet/maps-leaflet.component';

@NgModule({
  declarations: [MapsLeafletComponent],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    MapsLeafletExamplesModule,
    MapsLeafletRoutingModule,
  ],
})
export class MapsLeafletModule {}
