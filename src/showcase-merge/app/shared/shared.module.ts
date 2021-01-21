import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ApiViewerComponent } from './api-viewer/api-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';

@NgModule({
  declarations: [MarkdownViewerComponent, ApiViewerComponent],
  imports: [CommonModule, PortalModule],
  exports: [MarkdownViewerComponent, ApiViewerComponent],
})
export class SharedModule {}
