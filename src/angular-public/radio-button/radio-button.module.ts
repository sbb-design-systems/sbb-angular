import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { SbbRadioButton } from './radio-button/radio-button.component';

@NgModule({
  imports: [CommonModule, ɵRadioButtonModule],
  exports: [SbbRadioButton, ɵRadioButtonModule],
  declarations: [SbbRadioButton],
})
export class SbbRadioButtonModule {}
