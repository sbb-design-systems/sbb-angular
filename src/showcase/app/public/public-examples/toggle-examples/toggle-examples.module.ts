import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbDatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbToggleModule } from '@sbb-esta/angular-public/toggle';

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
    SbbDatepickerModule,
    SbbFormFieldModule,
    SbbToggleModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'toggle', EXAMPLE_INDEX)],
})
export class ToggleExamplesModule {}
