import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';

import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { ModeNotificationToastComponent } from './mode-notification-toast/mode-notification-toast.component';
import { PackageViewerComponent } from './package-viewer/package-viewer.component';

@NgModule({
  declarations: [MarkdownViewerComponent, ModeNotificationToastComponent, PackageViewerComponent],
  imports: [
    PortalModule,
    SbbButtonModule,
    SbbSidebarModule,
    SbbAccordionModule,
    RouterModule,
    CommonModule,
  ],
  exports: [MarkdownViewerComponent, PackageViewerComponent],
})
export class SharedModule {}
