import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ComponentViewerComponent } from './component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { SubmenuComponent } from './submenu/submenu.component';

@NgModule({
  declarations: [SubmenuComponent, MarkdownViewerComponent, ComponentViewerComponent],
  imports: [CommonModule],
  exports: [MarkdownViewerComponent, ComponentViewerComponent]
})
export class SharedModule {}
