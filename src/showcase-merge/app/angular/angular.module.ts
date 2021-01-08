import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbAccordionModule } from '@sbb-esta/angular-business/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular-business/sidebar';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';
import { ExamplesModule } from '@sbb-esta/components-examples';

import { ComponentViewerModule } from '../shared/component-viewer/component-viewer.module';
import { SharedModule } from '../shared/shared.module';

import { AngularRoutingModule } from './angular-routing.module';
import { AngularComponent } from './angular/angular.component';

@NgModule({
  declarations: [AngularComponent],
  imports: [
    CommonModule,
    PortalModule,
    ExamplesModule,
    SharedModule,
    ComponentViewerModule,
    SbbTabsModule,
    AngularRoutingModule,
    SbbSidebarModule,
    SbbAccordionModule,
  ],
})
export class AngularModule {}
