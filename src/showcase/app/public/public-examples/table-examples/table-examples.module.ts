import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbFieldModule } from '@sbb-esta/angular-public/field';
import { SbbRadioButtonModule } from '@sbb-esta/angular-public/radio-button';
import { SbbTableModule } from '@sbb-esta/angular-public/table';

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
    SbbButtonModule,
    SbbCheckboxModule,
    SbbFieldModule,
    SbbRadioButtonModule,
    SbbTableModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'table', EXAMPLE_INDEX)],
})
export class TableExamplesModule {}
