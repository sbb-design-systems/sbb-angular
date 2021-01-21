import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import {
  ExampleOutletComponent,
  ExampleViewerComponent,
} from './example-viewer/example-viewer.component';
import { StackblitzWriterService } from './stackblitz-writer/stackblitz-writer.service';

@NgModule({
  declarations: [ExampleViewerComponent, ExampleOutletComponent, ComponentViewerComponent],
  providers: [StackblitzWriterService],
  imports: [CommonModule, PortalModule, SbbIconModule, SbbTabsModule],
})
export class ComponentViewerModule {}
