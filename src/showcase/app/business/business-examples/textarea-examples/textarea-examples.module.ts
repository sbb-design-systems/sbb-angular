import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';
import { SbbTextareaModule } from '@sbb-esta/angular-business/textarea';

import { provideExamples } from '../../../shared/example-provider';

import { TextareaFormsExampleComponent } from './textarea-forms-example/textarea-forms-example.component';
import { TextareaNativeExampleComponent } from './textarea-native-example/textarea-native-example.component';
import { TextareaReactiveFormsWithSbbFormFieldExampleComponent } from './textarea-reactive-forms-with-sbb-form-field-example/textarea-reactive-forms-with-sbb-form-field-example.component';

const EXAMPLES = [
  TextareaFormsExampleComponent,
  TextareaNativeExampleComponent,
  TextareaReactiveFormsWithSbbFormFieldExampleComponent,
];

const EXAMPLE_INDEX = {
  'textarea-reactive-forms-with-sbb-form-field-example':
    TextareaReactiveFormsWithSbbFormFieldExampleComponent,
  'textarea-forms-example': TextareaFormsExampleComponent,
  'textarea-native-example': TextareaNativeExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbFormFieldModule,
    SbbTextareaModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'textarea', EXAMPLE_INDEX)],
})
export class TextareaExamplesModule {}
