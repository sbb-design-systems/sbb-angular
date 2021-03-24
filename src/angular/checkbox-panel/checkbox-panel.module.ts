import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SbbCheckboxPanel } from './checkbox-panel';
import {
  SbbCheckboxPanelNote,
  SbbCheckboxPanelSubtitle,
  SbbCheckboxPanelWarning,
} from './checkbox-panel-directives';

@NgModule({
  imports: [CommonModule],
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
