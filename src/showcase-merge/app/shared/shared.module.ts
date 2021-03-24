import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';

import { ApiViewerComponent } from './api-viewer/api-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { PackageViewerComponent } from './package-viewer/package-viewer.component';

@NgModule({
  declarations: [MarkdownViewerComponent, ApiViewerComponent, PackageViewerComponent],
  imports: [CommonModule, PortalModule, SbbSidebarModule, SbbAccordionModule, RouterModule],
  exports: [MarkdownViewerComponent, ApiViewerComponent, PackageViewerComponent],
})
export class SharedModule {}
