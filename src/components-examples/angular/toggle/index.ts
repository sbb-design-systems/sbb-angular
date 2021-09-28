import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbToggleModule } from '@sbb-esta/angular/toggle';

import { ToggleReactiveExample } from './toggle-reactive/toggle-reactive-example';
import { ToggleTemplateDrivenExample } from './toggle-template-driven/toggle-template-driven-example';
import { ToggleTripleExample } from './toggle-triple/toggle-triple-example';
import { ToggleWithoutFormExample } from './toggle-without-form/toggle-without-form-example';

export {
  ToggleReactiveExample,
  ToggleTemplateDrivenExample,
  ToggleWithoutFormExample,
  ToggleTripleExample,
};

const EXAMPLES = [
  ToggleReactiveExample,
  ToggleTemplateDrivenExample,
  ToggleWithoutFormExample,
  ToggleTripleExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbDatepickerModule,
    SbbInputModule,
    SbbToggleModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class ToggleExamplesModule {}
