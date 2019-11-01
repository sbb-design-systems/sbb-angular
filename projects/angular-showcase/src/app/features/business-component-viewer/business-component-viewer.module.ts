import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-business/tabs';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';

import { BusinessComponentViewerComponent } from './business-component-viewer/business-component-viewer.component';
import { BusinessExampleViewerComponent } from './example-viewer/business-example-viewer.component';
import { PsChromePatchDirective } from './ps-chrome-patch.directive';

@NgModule({
  declarations: [
    BusinessExampleViewerComponent,
    BusinessComponentViewerComponent,
    PsChromePatchDirective
  ],
  imports: [CommonModule, PortalModule, ScrollingModule, TabsModule]
})
export class BusinessComponentViewerModule {}
