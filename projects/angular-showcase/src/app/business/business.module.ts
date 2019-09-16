import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { SharedModule } from '../shared/shared.module';

import { BusinessExamplesModule } from './business-examples/business-examples.module';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business/business.component';
import { ComponentViewerComponent } from './component-viewer/component-viewer.component';

@NgModule({
  declarations: [BusinessComponent, ComponentViewerComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    PortalModule,
    BusinessExamplesModule,
    SharedModule,
    TabsModule,
    BusinessRoutingModule
  ]
})
export class BusinessModule {}
