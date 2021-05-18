import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbLink } from './link.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbLink],
  exports: [SbbLink],
})
export class SbbLinksModule {}
