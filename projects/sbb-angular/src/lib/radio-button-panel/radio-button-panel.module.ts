import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from '../radio-button/radio-button.module';
import { RadioButtonPanelComponent } from './radio-button-panel/radio-button-panel.component';

@NgModule({

  imports: [
    CommonModule,
    RadioButtonModule,
  ],
  declarations: [
    RadioButtonPanelComponent,
  ],
  exports: [
    RadioButtonPanelComponent
  ]
})
export class RadioButtonPanelModule { }
