import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { SbbRadioButtonPanel } from './radio-button-panel/radio-button-panel.component';

@NgModule({
  imports: [CommonModule, ɵRadioButtonModule],
  declarations: [SbbRadioButtonPanel],
  exports: [SbbRadioButtonPanel, ɵRadioButtonModule],
})
export class SbbRadioButtonPanelModule {}
