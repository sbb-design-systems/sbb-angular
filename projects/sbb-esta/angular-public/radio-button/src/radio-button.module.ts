import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ɵRadioButtonModule } from '@sbb-esta/angular-core/radio-button';

import { RadioButtonComponent } from './radio-button/radio-button.component';

@NgModule({
  imports: [CommonModule, ɵRadioButtonModule],
  exports: [RadioButtonComponent, ɵRadioButtonModule],
  declarations: [RadioButtonComponent]
})
export class RadioButtonModule {}
