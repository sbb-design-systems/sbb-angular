import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';

import { RadioButtonGroupHorizontalExample } from './radio-button-group-horizontal/radio-button-group-horizontal-example';
import { RadioButtonGroupReactiveFormsVerticalExample } from './radio-button-group-reactive-forms-vertical/radio-button-group-reactive-forms-vertical-example';
import { RadioButtonExample } from './radio-button/radio-button-example';

export {
  RadioButtonExample,
  RadioButtonGroupHorizontalExample,
  RadioButtonGroupReactiveFormsVerticalExample,
};

const EXAMPLES = [
  RadioButtonExample,
  RadioButtonGroupHorizontalExample,
  RadioButtonGroupReactiveFormsVerticalExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbRadioButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class RadioButtonExamplesModule {}
