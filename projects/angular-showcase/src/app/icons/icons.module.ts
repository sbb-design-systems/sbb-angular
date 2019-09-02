import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExamplesIconDocComponent } from './examples-icon-doc/examples-icon-doc.component';
import { IconViewerDirective } from './icon-viewer.directive';
import { IconsRoutingModule } from './icons-routing.module';

@NgModule({
  declarations: [IconViewerDirective, ExamplesIconDocComponent],
  imports: [CommonModule, IconsRoutingModule]
})
export class IconsModule {}
