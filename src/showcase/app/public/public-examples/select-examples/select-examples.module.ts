import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { SelectModule } from '@sbb-esta/angular-public/select';

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
  'select-forms-example': SelectFormsExampleComponent,
  'select-multi-selection-example': SelectMultiSelectionExampleComponent,
  'select-native-example': SelectNativeExampleComponent,
  'select-option-groups-example': SelectOptionGroupsExampleComponent,
  'select-option-groups-multi-selection-example': SelectOptionGroupsMultiSelectionExampleComponent,
  'select-reactive-forms-example': SelectReactiveFormsExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    FieldModule,
    SelectModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'select', EXAMPLE_INDEX)],
})
export class SelectExamplesModule {}
