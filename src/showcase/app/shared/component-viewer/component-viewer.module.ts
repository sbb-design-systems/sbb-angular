import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbTabsModule } from '@sbb-esta/angular-public/tabs';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';

@NgModule({
  declarations: [ExampleViewerComponent, ComponentViewerComponent],
  imports: [CommonModule, PortalModule, SbbTabsModule],
})
export class ComponentViewerModule {}
