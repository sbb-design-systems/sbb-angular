import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RadioButtonComponent } from './radio-button/radio-button.component';

@NgModule({
  imports: [CommonModule],
  exports: [RadioButtonComponent],
  declarations: [RadioButtonComponent]
})
export class RadioButtonModule {}
