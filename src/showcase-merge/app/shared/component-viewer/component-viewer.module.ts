import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular-business/notification';
import { SbbTooltipModule } from '@sbb-esta/angular-business/tooltip';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import {
  ExampleOutletComponent,
  ExampleViewerComponent,
} from './example-viewer/example-viewer.component';
import { StackblitzWriterService } from './stackblitz-writer/stackblitz-writer.service';
import { VariantLimitationComponent } from './variant-limitation-component/variant-limitation.component';

@NgModule({
  declarations: [
    ExampleViewerComponent,
    ExampleOutletComponent,
    ComponentViewerComponent,
    VariantLimitationComponent,
  ],
  providers: [StackblitzWriterService],
  imports: [
    CommonModule,
    PortalModule,
    SbbIconModule,
    SbbTabsModule,
    SbbNotificationModule,
    SbbTooltipModule,
  ],
})
export class ComponentViewerModule {}
