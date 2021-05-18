import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbCheckboxPanel } from './checkbox-panel/checkbox-panel.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbCheckboxPanel],
  exports: [SbbCheckboxPanel],
})
export class SbbCheckboxPanelModule {}
