import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [CheckboxPanelComponent],
  exports: [CheckboxPanelComponent],
})
export class CheckboxPanelModule {}
