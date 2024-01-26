import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbRadioButton, SbbRadioGroup } from './radio-button';

@NgModule({
  imports: [SbbCommonModule, SbbRadioButton, SbbRadioGroup],
  exports: [SbbRadioButton, SbbRadioGroup],
})
export class SbbRadioButtonModule {}
