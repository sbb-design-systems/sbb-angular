import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';
import { SbbSelectModule } from '@sbb-esta/angular-business/select';

import { provideExamples } from '../../../shared/example-provider';

import { SelectFormsExampleComponent } from './select-forms-example/select-forms-example.component';
import { SelectMultiSelectionExampleComponent } from './select-multi-selection-example/select-multi-selection-example.component';
import { SelectNativeExampleComponent } from './select-native-example/select-native-example.component';
import { SelectOptionGroupsExampleComponent } from './select-option-groups-example/select-option-groups-example.component';
import { SelectOptionGroupsMultiSelectionExampleComponent } from './select-option-groups-multi-selection-example/select-option-groups-multi-selection-example.component';
import { SelectReactiveFormsExampleComponent } from './select-reactive-forms-example/select-reactive-forms-example.component';

const EXAMPLES = [
  SelectFormsExampleComponent,
  SelectMultiSelectionExampleComponent,
  SelectNativeExampleComponent,
  SelectOptionGroupsExampleComponent,
  SelectOptionGroupsMultiSelectionExampleComponent,
  SelectReactiveFormsExampleComponent,
];

const EXAMPLE_INDEX = {
  'select-reactive-forms-example': SelectReactiveFormsExampleComponent,
  'select-forms-example': SelectFormsExampleComponent,
  'select-native-example': SelectNativeExampleComponent,
  'select-multi-selection-example': SelectMultiSelectionExampleComponent,
  'select-option-groups-example': SelectOptionGroupsExampleComponent,
  'select-option-groups-multi-selection-example': SelectOptionGroupsMultiSelectionExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbFormFieldModule,
    SbbSelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'select', EXAMPLE_INDEX)],
})
export class SelectExamplesModule {}
