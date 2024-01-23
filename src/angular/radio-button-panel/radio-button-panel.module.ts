import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

import { SbbRadioButtonPanel } from './radio-button-panel';
import {
  SbbRadioButtonPanelNote,
  SbbRadioButtonPanelSubtitle,
  SbbRadioButtonPanelWarning,
} from './radio-button-panel-directives';

@NgModule({
  imports: [SbbCommonModule],
  declarations: [
    SbbRadioButtonPanel,
    SbbRadioButtonPanelSubtitle,
    SbbRadioButtonPanelWarning,
    SbbRadioButtonPanelNote,
  ],
  exports: [
    SbbRadioButtonModule,
    SbbRadioButtonPanel,
    SbbRadioButtonPanelSubtitle,
    SbbRadioButtonPanelWarning,
    SbbRadioButtonPanelNote,
  ],
})
export class SbbRadioButtonPanelModule {}
