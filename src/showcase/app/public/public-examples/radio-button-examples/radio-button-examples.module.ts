import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';

import { provideExamples } from '../../../shared/example-provider';

import { RadioButtonExampleComponent } from './radio-button-example/radio-button-example.component';
import { RadioButtonGroupExampleComponent } from './radio-button-group-example/radio-button-group-example.component';

const EXAMPLES = [RadioButtonExampleComponent, RadioButtonGroupExampleComponent];

const EXAMPLE_INDEX = {
  'radio-button-example': RadioButtonExampleComponent,
  'radio-button-group-example': RadioButtonGroupExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, RadioButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'radio', EXAMPLE_INDEX)],
})
export class RadioButtonExamplesModule {}
