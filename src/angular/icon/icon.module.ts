import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbIcon } from './icon';

@NgModule({
  imports: [SbbCommonModule],
  declarations: [SbbIcon],
  exports: [SbbIcon],
})
export class SbbIconModule {}
