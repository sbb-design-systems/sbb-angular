import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-public/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SharedModule } from '../shared/shared.module';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business/business.component';
import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { ExamplesModule } from './examples/examples.module';

@NgModule({
  declarations: [BusinessComponent, ComponentViewerComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    PortalModule,
    ExamplesModule,
    SharedModule,
    TabsModule,
    BusinessRoutingModule
  ]
})
export class BusinessModule {}
