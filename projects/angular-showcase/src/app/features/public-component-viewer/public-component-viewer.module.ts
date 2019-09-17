import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { PublicExampleViewerComponent } from './example-viewer/public-example-viewer.component';
import { PsChromePatchDirective } from './ps-chrome-patch.directive';
import { PublicComponentViewerComponent } from './public-component-viewer/public-component-viewer.component';

@NgModule({
  declarations: [
    PublicExampleViewerComponent,
    PublicComponentViewerComponent,
    PsChromePatchDirective
  ],
  imports: [CommonModule, PortalModule, ScrollingModule, TabsModule]
})
export class PublicComponentViewerModule {}
