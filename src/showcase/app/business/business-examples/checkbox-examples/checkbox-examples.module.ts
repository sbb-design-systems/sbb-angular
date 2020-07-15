import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';

import { provideExamples } from '../../../shared/example-provider';

import { CheckboxExampleComponent } from './checkbox-example/checkbox-example.component';
import { CheckboxGroupExampleComponent } from './checkbox-group-example/checkbox-group-example.component';
import { CheckboxIndeterminateStateExampleComponent } from './checkbox-indeterminate-state-example/checkbox-indeterminate-state-example.component';

const EXAMPLES = [
  CheckboxExampleComponent,
  CheckboxGroupExampleComponent,
  CheckboxIndeterminateStateExampleComponent,
];

const EXAMPLE_INDEX = {
  'checkbox-example': CheckboxExampleComponent,
  'checkbox-indeterminate-state-example': CheckboxIndeterminateStateExampleComponent,
  'checkbox-group-example': CheckboxGroupExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'checkbox', EXAMPLE_INDEX)],
})
export class CheckboxExamplesModule {}
