import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

import { CheckboxGroupHorizontalExample } from './checkbox-group-horizontal/checkbox-group-horizontal-example';
import { CheckboxGroupReactiveFormsVerticalExample } from './checkbox-group-reactive-forms-vertical/checkbox-group-reactive-forms-vertical-example';
import { CheckboxIndeterminateStateExample } from './checkbox-indeterminate-state/checkbox-indeterminate-state-example';
import { CheckboxExample } from './checkbox/checkbox-example';

export {
  CheckboxExample,
  CheckboxGroupHorizontalExample,
  CheckboxGroupReactiveFormsVerticalExample,
  CheckboxIndeterminateStateExample,
};

const EXAMPLES = [
  CheckboxExample,
  CheckboxGroupHorizontalExample,
  CheckboxGroupReactiveFormsVerticalExample,
  CheckboxIndeterminateStateExample,
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SbbCheckboxModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CheckboxExamplesModule {}
