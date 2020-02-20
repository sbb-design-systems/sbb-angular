import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-business/tabs';

import { BusinessComponentViewerComponent } from './business-component-viewer/business-component-viewer.component';
import { BusinessExampleViewerComponent } from './business-example-viewer/business-example-viewer.component';

@NgModule({
  declarations: [BusinessExampleViewerComponent, BusinessComponentViewerComponent],
  imports: [CommonModule, PortalModule, TabsModule]
})
export class BusinessComponentViewerModule {}
