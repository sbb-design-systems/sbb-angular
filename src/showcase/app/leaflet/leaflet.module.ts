import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { LeafletExamplesModule } from './leaflet-examples/leaflet-examples.module';
import { LeafletRoutingModule } from './leaflet-routing.module';
import { LeafletComponent } from './leaflet/leaflet.component';

@NgModule({
  declarations: [LeafletComponent],
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    LeafletExamplesModule,
    LeafletRoutingModule
  ]
})
export class LeafletModule {}
