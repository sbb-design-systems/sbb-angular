import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbRadioButtonPanelModule } from '@sbb-esta/angular/radio-button-panel';
import { SbbSelectModule } from '@sbb-esta/angular/select';

import { RadioButtonPanelContentExample } from './radio-button-panel-content/radio-button-panel-content-example';
import { RadioButtonPanelGroupExample } from './radio-button-panel-group/radio-button-panel-group-example';
import { RadioButtonPanelIconExample } from './radio-button-panel-icon/radio-button-panel-icon-example';
import { RadioButtonPanelSimpleExample } from './radio-button-panel-simple/radio-button-panel-simple-example';

export {
  RadioButtonPanelSimpleExample,
  RadioButtonPanelContentExample,
  RadioButtonPanelGroupExample,
  RadioButtonPanelIconExample,
};

const EXAMPLES = [
  RadioButtonPanelSimpleExample,
  RadioButtonPanelContentExample,
  RadioButtonPanelGroupExample,
  RadioButtonPanelIconExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbInputModule,
    SbbIconModule,
    SbbRadioButtonPanelModule,
    SbbSelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class RadioButtonPanelExamplesModule {}
