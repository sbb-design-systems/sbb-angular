import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';

import { SbbCheckbox } from './checkbox/checkbox.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbCheckbox],
  exports: [SbbCheckbox],
})
export class SbbCheckboxModule {}
