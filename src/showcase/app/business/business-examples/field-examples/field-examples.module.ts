import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbDatepickerModule } from '@sbb-esta/angular-business/datepicker';
import { SbbFieldModule } from '@sbb-esta/angular-business/field';
import { SbbSelectModule } from '@sbb-esta/angular-business/select';

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
    SbbButtonModule,
    SbbCheckboxModule,
    SbbDatepickerModule,
    SbbFieldModule,
    SbbSelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'field', EXAMPLE_INDEX)],
})
export class FieldExamplesModule {}
