import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbCheckboxPanel } from './checkbox-panel';
import {
  SbbCheckboxPanelNote,
  SbbCheckboxPanelSubtitle,
  SbbCheckboxPanelWarning,
} from './checkbox-panel-directives';

@NgModule({
  imports: [SbbCommonModule],
  declarations: [
    SbbCheckboxPanel,
    SbbCheckboxPanelSubtitle,
    SbbCheckboxPanelWarning,
    SbbCheckboxPanelNote,
  ],
  exports: [
    SbbCheckboxPanel,
    SbbCheckboxPanelSubtitle,
    SbbCheckboxPanelWarning,
    SbbCheckboxPanelNote,
  ],
})
export class SbbCheckboxPanelModule {}
