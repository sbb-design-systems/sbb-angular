import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbEsriConfigModule } from '@sbb-esta/angular-maps';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { MapsExamplesModule } from './maps-examples/maps-examples.module';
import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './maps/maps.component';

@NgModule({
  declarations: [MapsComponent],
  imports: [
    SbbEsriConfigModule.forRoot(),
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    MapsExamplesModule,
    MapsRoutingModule,
    SbbAccordionModule,
    SbbSidebarModule,
  ],
})
export class MapsModule {}
