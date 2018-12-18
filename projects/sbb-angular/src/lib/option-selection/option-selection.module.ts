import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionSelectionComponent } from './option-selection/option-selection.component';
import { RadioButtonModule } from 'sbb-angular';
import { RadioButtonComponent } from '../radio-button/radio-button/radio-button.component';

@NgModule({
  imports: [
    CommonModule,
    RadioButtonModule
  ],
  declarations: [OptionSelectionComponent],
  exports: [
    OptionSelectionComponent
  ]
})
export class OptionSelectionModule { }
