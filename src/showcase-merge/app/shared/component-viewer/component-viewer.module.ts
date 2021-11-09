import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';
import { SbbNotificationToastModule } from '@sbb-esta/angular/notification-toast';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { ExampleListViewerComponent } from './example-list-viewer/example-list-viewer.component';
import {
  ExampleOutletComponent,
  ExampleViewerComponent,
} from './example-viewer/example-viewer.component';
import { HtmlViewerComponent } from './html-viewer/html-viewer.component';
import { StackBlitzButton } from './stack-blitz/stack-blitz-button';
import { StackBlitzWriter } from './stack-blitz/stack-blitz-writer';
import { VariantLimitationComponent } from './variant-limitation-component/variant-limitation.component';

@NgModule({
  declarations: [
    ExampleListViewerComponent,
    ExampleViewerComponent,
    ExampleOutletComponent,
    ComponentViewerComponent,
    VariantLimitationComponent,
    HtmlViewerComponent,
    StackBlitzButton,
  ],
  providers: [StackBlitzWriter],
  imports: [
    CommonModule,
    PortalModule,
    SbbIconModule,
    SbbTabsModule,
    SbbNotificationModule,
    SbbNotificationToastModule,
    SbbTooltipModule,
    SbbButtonModule,
    RouterModule,
  ],
})
export class ComponentViewerModule {}
