import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { PublicExamplesModule } from './public-examples/public-examples.module';
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public/public.component';

@NgModule({
  declarations: [PublicComponent],
  imports: [
    CommonModule,
    PortalModule,
    PublicExamplesModule,
    SharedModule,
    ComponentViewerModule,
    SbbTabsModule,
    PublicRoutingModule,
    SbbSidebarModule,
    SbbAccordionModule,
  ],
})
export class PublicModule {}
