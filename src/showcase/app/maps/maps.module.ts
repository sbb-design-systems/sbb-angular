import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { EsriConfigModule } from '@sbb-esta/angular-maps';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { MapsExamplesModule } from './maps-examples/maps-examples.module';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps/maps.component';

@NgModule({
  declarations: [MapsComponent],
  imports: [
    EsriConfigModule.forRoot({ portalUrl: 'https://www.arcgis.com' }),
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    MapsExamplesModule,
    MapsRoutingModule,
    AccordionModule,
    SbbSidebarModule,
  ],
})
export class MapsModule {}
