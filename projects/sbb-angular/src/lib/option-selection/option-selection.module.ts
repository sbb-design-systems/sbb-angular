import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionSelectionComponent } from './option-selection/option-selection.component';
import { RadioButtonModule } from 'sbb-angular';
import { OptionSelectionImageDirective } from './option-selection/option-selection-image.directive';

@NgModule({
  imports: [
    CommonModule,
    RadioButtonModule
  ],
  declarations: [
    OptionSelectionComponent,
    OptionSelectionImageDirective
  ],
  exports: [
    OptionSelectionComponent,
    OptionSelectionImageDirective
  ]
})
export class OptionSelectionModule { }
