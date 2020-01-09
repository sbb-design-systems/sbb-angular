import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { PsChromePatchModule } from '../ps-chrome-patch/ps-chrome-patch.module';

import { PublicComponentViewerComponent } from './public-component-viewer/public-component-viewer.component';
import { PublicExampleViewerComponent } from './public-example-viewer/public-example-viewer.component';

@NgModule({
  declarations: [PublicExampleViewerComponent, PublicComponentViewerComponent],
  imports: [CommonModule, PortalModule, ScrollingModule, TabsModule, PsChromePatchModule]
})
export class PublicComponentViewerModule {}
