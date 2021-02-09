import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbTextareaModule } from '@sbb-esta/angular/textarea';

import { TextareaFormsExample } from './textarea-forms/textarea-forms-example';
import { TextareaNativeExample } from './textarea-native/textarea-native-example';
import { TextareaReactiveFormsWithSbbFormFieldExample } from './textarea-reactive-forms-with-sbb-form-field/textarea-reactive-forms-with-sbb-form-field-example';

export {
  TextareaFormsExample,
  TextareaNativeExample,
  TextareaReactiveFormsWithSbbFormFieldExample,
};

const EXAMPLES = [
  TextareaFormsExample,
  TextareaNativeExample,
  TextareaReactiveFormsWithSbbFormFieldExample,
];

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
})
export class TextareaExamplesModule {}
