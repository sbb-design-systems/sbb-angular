import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-business/tabs';

import { BusinessExampleViewerComponent } from './example-viewer/business-example-viewer.component';
import { PsChromePatchDirective } from './ps-chrome-patch.directive';
import { BusinessComponentViewerComponent } from './business-component-viewer/business-component-viewer.component';

@NgModule({
  declarations: [
    BusinessExampleViewerComponent,
    BusinessComponentViewerComponent,
    PsChromePatchDirective
  ],
  imports: [CommonModule, PortalModule, ScrollingModule, TabsModule]
})
export class BusinessComponentViewerModule {}
