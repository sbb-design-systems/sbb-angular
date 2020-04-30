import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { RadioButtonPanelComponent } from './radio-button-panel/radio-button-panel.component';

@NgModule({
  imports: [CommonModule, ɵRadioButtonModule],
  declarations: [RadioButtonPanelComponent],
  exports: [RadioButtonPanelComponent, ɵRadioButtonModule]
})
export class RadioButtonPanelModule {}
