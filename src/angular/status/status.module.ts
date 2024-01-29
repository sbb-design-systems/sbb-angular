import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbStatus } from './status';

@NgModule({
  imports: [CommonModule, SbbCommonModule, SbbIconModule, SbbStatus],
  exports: [SbbStatus],
})
export class SbbStatusModule {}
