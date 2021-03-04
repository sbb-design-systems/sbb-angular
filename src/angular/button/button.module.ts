import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAnchor, SbbButton } from './button';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbButton, SbbAnchor],
  exports: [SbbButton, SbbAnchor],
})
export class SbbButtonModule {}
