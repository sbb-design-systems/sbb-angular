import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { ApiViewerComponent } from './api-viewer/api-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { SubmenuComponent } from './submenu/submenu.component';

@NgModule({
  declarations: [SubmenuComponent, MarkdownViewerComponent, ApiViewerComponent],
  imports: [CommonModule, ScrollingModule, PortalModule, TabsModule],
  exports: [SubmenuComponent, MarkdownViewerComponent, ApiViewerComponent]
})
export class SharedModule {}
