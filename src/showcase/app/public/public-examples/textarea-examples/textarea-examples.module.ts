import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { TextareaModule } from '@sbb-esta/angular-public/textarea';

import { provideExamples } from '../../../shared/example-provider';

import { TextareaFormsExampleComponent } from './textarea-forms-example/textarea-forms-example.component';
import { TextareaNativeExampleComponent } from './textarea-native-example/textarea-native-example.component';
import { TextareaReactiveFormsWithSbbFieldExampleComponent } from './textarea-reactive-forms-with-sbb-field-example/textarea-reactive-forms-with-sbb-field-example.component';

const EXAMPLES = [
  TextareaFormsExampleComponent,
  TextareaNativeExampleComponent,
  TextareaReactiveFormsWithSbbFieldExampleComponent,
];

const EXAMPLE_INDEX = {
  'textarea-reactive-forms-with-sbb-field-example': TextareaReactiveFormsWithSbbFieldExampleComponent,
  'textarea-forms-example': TextareaFormsExampleComponent,
  'textarea-native-example': TextareaNativeExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    FieldModule,
    TextareaModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'textarea', EXAMPLE_INDEX)],
})
export class TextareaExamplesModule {}
