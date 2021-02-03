import { NgModule } from '@angular/core';

import { SbbRadioButton, SbbRadioGroup } from './radio-button.component';

@NgModule({
  exports: [SbbRadioButton, SbbRadioGroup],
  declarations: [SbbRadioButton, SbbRadioGroup],
})
export class SbbRadioButtonModule {}
