import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { TextareaModule } from '@sbb-esta/angular-business/textarea';

import { TextareaFormsExampleComponent } from './textarea-forms-example/textarea-forms-example.component';
import { TextareaNativeExampleComponent } from './textarea-native-example/textarea-native-example.component';
import { TextareaReactiveFormsWithSbbFieldExampleComponent } from './textarea-reactive-forms-with-sbbfield-example/textarea-reactive-forms-with-sbb-field-example.component';

const EXAMPLES = [
  TextareaFormsExampleComponent,
  TextareaNativeExampleComponent,
  TextareaReactiveFormsWithSbbFieldExampleComponent,
];

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
})
export class TextareaExamplesModule {}
