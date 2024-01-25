import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbTimeInput } from './time-input';

@NgModule({
  imports: [SbbCommonModule, SbbTimeInput],
  exports: [SbbTimeInput],
})
export class SbbTimeInputModule {}
