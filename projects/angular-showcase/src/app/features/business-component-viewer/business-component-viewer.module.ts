import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-business/tabs';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';

import { PsChromePatchModule } from '../ps-chrome-patch/ps-chrome-patch.module';

import { BusinessExampleViewerComponent } from './business-example-viewer/business-example-viewer.component';
import { BusinessComponentViewerComponent } from './business-component-viewer/business-component-viewer.component';

@NgModule({
  declarations: [BusinessExampleViewerComponent, BusinessComponentViewerComponent],
  imports: [CommonModule, PortalModule, ScrollingModule, TabsModule, PsChromePatchModule]
})
export class BusinessComponentViewerModule {}
