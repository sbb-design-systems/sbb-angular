import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbStatus } from './status.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbStatus],
  exports: [SbbStatus],
})
export class SbbStatusModule {}
