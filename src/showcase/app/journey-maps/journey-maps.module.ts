import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { JourneyMapsRoutingModule } from './journey-maps-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    JourneyMapsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class JourneyMapsModule {}
