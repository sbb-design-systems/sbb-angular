import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from '@sbb-esta/angular-public/tabs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ExampleViewerComponent } from './example-viewer/example-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { SubmenuComponent } from './submenu/submenu.component';

@NgModule({
  declarations: [SubmenuComponent, MarkdownViewerComponent, ExampleViewerComponent],
  imports: [CommonModule, PerfectScrollbarModule, PortalModule, TabsModule],
  exports: [SubmenuComponent, MarkdownViewerComponent, ExampleViewerComponent]
})
export class SharedModule {}
