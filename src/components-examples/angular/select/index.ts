import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

import { SelectFormsExample } from './select-forms/select-forms-example';
import { SelectMultiSelectionExample } from './select-multi-selection/select-multi-selection-example';
import { SelectNativeExample } from './select-native/select-native-example';
import { SelectOptionGroupsMultiSelectionExample } from './select-option-groups-multi-selection/select-option-groups-multi-selection-example';
import { SelectOptionGroupsExample } from './select-option-groups/select-option-groups-example';
import { SelectReactiveFormsExample } from './select-reactive-forms/select-reactive-forms-example';

export {
  SelectFormsExample,
  SelectMultiSelectionExample,
  SelectNativeExample,
  SelectOptionGroupsExample,
  SelectOptionGroupsMultiSelectionExample,
  SelectReactiveFormsExample,
};

const EXAMPLES = [
  SelectFormsExample,
  SelectMultiSelectionExample,
  SelectNativeExample,
  SelectOptionGroupsExample,
  SelectOptionGroupsMultiSelectionExample,
  SelectReactiveFormsExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbInputModule,
    SbbSelectModule,
    SbbTooltipModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class SelectExamplesModule {}
