import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { LinkComponent } from './link/link.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [LinkComponent],
  exports: [LinkComponent],
})
export class LinksModule {}
