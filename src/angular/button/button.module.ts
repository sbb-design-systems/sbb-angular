import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAnchor, SbbButton } from './button';

@NgModule({
  imports: [SbbCommonModule, SbbIconModule, SbbButton, SbbAnchor],
  exports: [SbbButton, SbbAnchor],
})
export class SbbButtonModule {}
