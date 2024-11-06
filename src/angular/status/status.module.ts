import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbStatus } from './status';

@NgModule({
  imports: [SbbCommonModule, SbbIconModule, SbbStatus],
  exports: [SbbStatus],
})
export class SbbStatusModule {}
