import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbInputModule } from '@sbb-esta/angular/input';

import { InputErrorStateMatcherExample } from './input-error-state-matcher/input-error-state-matcher-example';
import { InputErrorsExample } from './input-errors/input-errors-example';
import { InputFormExample } from './input-form/input-form-example';
import { InputOverviewExample } from './input-overview/input-overview-example';

export {
  InputErrorStateMatcherExample,
  InputErrorsExample,
  InputFormExample,
  InputOverviewExample,
};

const EXAMPLES = [
  InputErrorStateMatcherExample,
  InputErrorsExample,
  InputFormExample,
  InputOverviewExample,
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbInputModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES,
})
export class InputExamplesModule {}
