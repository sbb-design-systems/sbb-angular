import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadioButtonRegistryService } from './radio-button/radio-button-registry.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    RadioButtonComponent
  ],
  declarations: [RadioButtonComponent],
  providers: [RadioButtonRegistryService]
})
export class RadioButtonModule { }
