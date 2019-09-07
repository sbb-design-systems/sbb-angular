import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

import { RadioButtonPanelComponent } from './radio-button-panel/radio-button-panel.component';

@NgModule({
  imports: [CommonModule, RadioButtonModule],
  declarations: [RadioButtonPanelComponent],
  exports: [RadioButtonPanelComponent]
})
export class RadioButtonPanelModule {}
