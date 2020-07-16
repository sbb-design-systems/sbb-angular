import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

import { provideExamples } from '../../../shared/example-provider';

import { RadioButtonExampleComponent } from './radio-button-example/radio-button-example.component';
import { RadioButtonGroupExampleComponent } from './radio-button-group-example/radio-button-group-example.component';
import { RadioButtonGroupReactiveFormsExampleComponent } from './radio-button-group-reactive-forms-example/radio-button-group-reactive-forms-example.component';

const EXAMPLES = [
  RadioButtonExampleComponent,
  RadioButtonGroupExampleComponent,
  RadioButtonGroupReactiveFormsExampleComponent,
];

const EXAMPLE_INDEX = {
  'radio-button-group-reactive-forms-example': RadioButtonGroupReactiveFormsExampleComponent,
  'radio-button-group-example': RadioButtonGroupExampleComponent,
  'radio-button-example': RadioButtonExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, RadioButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'radio-button', EXAMPLE_INDEX)],
})
export class RadioButtonExamplesModule {}
