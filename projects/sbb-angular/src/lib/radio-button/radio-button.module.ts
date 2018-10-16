import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent, RadioControlRegistry } from './radio-button/radio-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    RadioButtonComponent
  ],
  declarations: [RadioButtonComponent],
  providers: [RadioControlRegistry]
})
export class RadioButtonModule { }
