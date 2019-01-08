import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from '../radio-button/radio-button.module';
import { OptionSelectionComponent } from './option-selection/option-selection.component';
import { OptionSelectionMultipleComponent } from './option-selection-multiple/option-selection-multiple.component';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';

@NgModule({

  imports: [
    CommonModule,
    RadioButtonModule,
    CheckboxModule,
    IconCommonModule
  ],
  declarations: [
    OptionSelectionComponent,
    OptionSelectionMultipleComponent
  ],
  exports: [
    OptionSelectionComponent,
    OptionSelectionMultipleComponent
  ]
})
export class OptionSelectionModule { }
