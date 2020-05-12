import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconHeartModule } from '@sbb-esta/angular-icons/basic';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { RadioButtonPanelModule } from '@sbb-esta/angular-public/radio-button-panel';

import { RadioButtonPanelExampleComponent } from './radio-button-panel-example/radio-button-panel-example.component';

const EXAMPLES = [RadioButtonPanelExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconHeartModule,
    CheckboxModule,
    RadioButtonPanelModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class RadioButtonPanelExamplesModule {}
