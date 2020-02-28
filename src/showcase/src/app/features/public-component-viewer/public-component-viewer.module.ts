import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { PublicComponentViewerComponent } from './public-component-viewer/public-component-viewer.component';
import { PublicExampleViewerComponent } from './public-example-viewer/public-example-viewer.component';

@NgModule({
  declarations: [PublicExampleViewerComponent, PublicComponentViewerComponent],
  imports: [CommonModule, PortalModule, TabsModule]
})
export class PublicComponentViewerModule {}
