import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { DatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { ToggleModule } from '@sbb-esta/angular-public/toggle';

import { provideExamples } from '../../../shared/example-provider';

import { ToggleExampleComponent } from './toggle-example/toggle-example.component';

const EXAMPLES = [ToggleExampleComponent];

const EXAMPLE_INDEX = {
  'toggle-example': ToggleExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    DatepickerModule,
    FieldModule,
    ToggleModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'toggle', EXAMPLE_INDEX)],
})
export class ToggleExamplesModule {}
