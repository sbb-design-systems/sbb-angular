import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollingModule } from '@sbb-esta/angular-core/scrolling';
import { TabsModule } from '@sbb-esta/angular-public/tabs';

import { ApiViewerComponent } from './api-viewer/api-viewer.component';
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { SubmenuComponent } from './submenu/submenu.component';

@NgModule({
  declarations: [
    SubmenuComponent,
    MarkdownViewerComponent,
    ExampleViewerComponent,
    ApiViewerComponent
  ],
  imports: [CommonModule, ScrollingModule, PortalModule, TabsModule],
  exports: [SubmenuComponent, MarkdownViewerComponent, ExampleViewerComponent, ApiViewerComponent]
})
export class SharedModule {}
