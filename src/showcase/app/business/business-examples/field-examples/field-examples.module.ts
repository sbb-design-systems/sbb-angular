import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { DatepickerModule } from '@sbb-esta/angular-business/datepicker';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { SelectModule } from '@sbb-esta/angular-business/select';

import { provideExamples } from '../../../shared/example-provider';

import { FieldExampleComponent } from './field-example/field-example.component';

const EXAMPLES = [FieldExampleComponent];

const EXAMPLE_INDEX = {
  'field-example': FieldExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DatepickerModule,
    FieldModule,
    SelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'field', EXAMPLE_INDEX)],
})
export class FieldExamplesModule {}
