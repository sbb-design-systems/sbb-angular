import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { RadioButtonModule } from '@sbb-esta/angular-public/radio-button';
import { TableModule } from '@sbb-esta/angular-public/table';

import { provideExamples } from '../../../shared/example-provider';

import { TableExampleComponent } from './table-example/table-example.component';

const EXAMPLES = [TableExampleComponent];

const EXAMPLE_INDEX = {
  'table-example': TableExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    FieldModule,
    RadioButtonModule,
    TableModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'table', EXAMPLE_INDEX)],
})
export class TableExamplesModule {}
