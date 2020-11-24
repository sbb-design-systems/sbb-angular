import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbDatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbToggleModule } from '@sbb-esta/angular-public/toggle';

import { provideExamples } from '../../../shared/example-provider';

import { ToggleReactiveExampleComponent } from './toggle-reactive-example/toggle-reactive-example.component';
import { ToggleTemplateDrivenExampleComponent } from './toggle-template-driven-example/toggle-template-driven-example.component';
import { ToggleWithoutFormExampleComponent } from './toggle-without-form-example/toggle-without-form-example.component';

const EXAMPLES = [
  ToggleReactiveExampleComponent,
  ToggleTemplateDrivenExampleComponent,
  ToggleWithoutFormExampleComponent,
];

const EXAMPLE_INDEX = {
  'toggle-reactive-example': ToggleReactiveExampleComponent,
  'toggle-template-driven-example': ToggleTemplateDrivenExampleComponent,
  'toggle-without-form-example': ToggleWithoutFormExampleComponent,
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
