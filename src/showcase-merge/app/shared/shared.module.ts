import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbAccordionModule } from '@sbb-esta/angular/accordion';
import { SbbSidebarModule } from '@sbb-esta/angular/sidebar';

import { ApiViewerComponent } from './api-viewer/api-viewer.component';
import { LibraryViewerComponent } from './library-viewer/library-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';

@NgModule({
  declarations: [MarkdownViewerComponent, ApiViewerComponent, LibraryViewerComponent],
  imports: [CommonModule, PortalModule, SbbSidebarModule, SbbAccordionModule, RouterModule],
  exports: [MarkdownViewerComponent, ApiViewerComponent, LibraryViewerComponent],
})
export class SharedModule {}
