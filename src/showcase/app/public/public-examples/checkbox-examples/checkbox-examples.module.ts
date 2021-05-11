import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';

import { provideExamples } from '../../../shared/example-provider';

import { CheckboxExampleComponent } from './checkbox-example/checkbox-example.component';
import { CheckboxGroupHorizontalExampleComponent } from './checkbox-group-horizontal-example/checkbox-group-horizontal-example.component';
import { CheckboxGroupReactiveFormsVerticalExampleComponent } from './checkbox-group-reactive-forms-vertical-example/checkbox-group-reactive-forms-vertical-example.component';

const EXAMPLES = [
  CheckboxExampleComponent,
  CheckboxGroupHorizontalExampleComponent,
  CheckboxGroupReactiveFormsVerticalExampleComponent,
];

const EXAMPLE_INDEX = {
  'checkbox-group-reactive-forms-vertical-example':
    CheckboxGroupReactiveFormsVerticalExampleComponent,
  'checkbox-group-horizontal-example': CheckboxGroupHorizontalExampleComponent,
  'checkbox-example': CheckboxExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbCheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'checkbox', EXAMPLE_INDEX)],
})
export class CheckboxExamplesModule {}
