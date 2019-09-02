import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { MarkdownViewerComponent } from './markdown-viewer/markdown-viewer.component';
import { SubmenuComponent } from './submenu/submenu.component';

@NgModule({
  declarations: [SubmenuComponent, MarkdownViewerComponent],
  imports: [CommonModule, PerfectScrollbarModule],
  exports: [SubmenuComponent, MarkdownViewerComponent]
})
export class SharedModule {}
