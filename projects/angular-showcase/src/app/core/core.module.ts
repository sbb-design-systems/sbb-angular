import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-public/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { SharedModule } from '../shared/shared.module';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core/core.component';
import { ExamplesModule } from './examples/examples.module';

@NgModule({
  declarations: [CoreComponent, ComponentViewerComponent],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    PortalModule,
    ExamplesModule,
    SharedModule,
    TabsModule,
    CoreRoutingModule
  ]
})
export class CoreModule {}
