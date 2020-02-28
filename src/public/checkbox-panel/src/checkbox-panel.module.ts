import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconTickModule } from '@sbb-esta/angular-icons';

import { CheckboxPanelComponent } from './checkbox-panel/checkbox-panel.component';

@NgModule({
  imports: [CommonModule, IconTickModule],
  declarations: [CheckboxPanelComponent],
  exports: [CheckboxPanelComponent]
})
export class CheckboxPanelModule {}
