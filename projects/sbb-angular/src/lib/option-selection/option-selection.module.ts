import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionSelectionComponent } from './option-selection/option-selection.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OptionSelectionComponent],
  exports: [OptionSelectionComponent]
})
export class OptionSelectionModule { }
