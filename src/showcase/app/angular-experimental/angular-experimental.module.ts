import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { AngularExperimentalRoutingModule } from './angular-experimental-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    SharedModule,
    ComponentViewerModule,
    AngularExperimentalRoutingModule,
  ],
})
export class AngularExperimentalModule {}
