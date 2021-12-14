import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbTimeInput } from './time-input';

@NgModule({
  imports: [SbbCommonModule],
  declarations: [SbbTimeInput],
  exports: [SbbTimeInput],
})
export class SbbTimeInputModule {}
