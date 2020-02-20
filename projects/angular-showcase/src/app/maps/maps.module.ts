import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsriConfigModule } from '@sbb-esta/angular-maps';

import { SharedModule } from '../shared/shared.module';

import { MapsExamplesModule } from './maps-examples/maps-examples.module';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps/maps.component';

@NgModule({
  declarations: [MapsComponent],
  imports: [
    EsriConfigModule.forRoot({ portalUrl: 'https://www.arcgis.com' }),
    CommonModule,
    MapsRoutingModule,
    PortalModule,
    MapsExamplesModule,
    SharedModule
  ]
})
export class MapsModule {}
