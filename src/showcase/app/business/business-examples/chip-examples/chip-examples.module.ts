import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular-business/autocomplete';
import { SbbChipModule } from '@sbb-esta/angular-business/chip';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';

import { provideExamples } from '../../../shared/example-provider';

import { AutocompleteChipInputExampleComponent } from './autocomplete-chip-input-example/autocomplete-chip-input-example.component';
import { DisabledChipInputExampleComponent } from './disabled-chip-input-example/disabled-chip-input-example.component';
import { FormsChipInputExampleComponent } from './forms-chip-input-example/forms-chip-input-example.component';
import { ReactiveFormsChipInputExampleComponent } from './reactive-forms-chip-input-example/reactive-forms-chip-input-example.component';

const EXAMPLES = [
  AutocompleteChipInputExampleComponent,
  DisabledChipInputExampleComponent,
  FormsChipInputExampleComponent,
  ReactiveFormsChipInputExampleComponent,
];

const EXAMPLE_INDEX = {
  'reactive-forms-chip-input-example': ReactiveFormsChipInputExampleComponent,
  'forms-chip-input-example': FormsChipInputExampleComponent,
  'disabled-chip-input-example': DisabledChipInputExampleComponent,
  'autocomplete-chip-input-example': AutocompleteChipInputExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbAutocompleteModule,
    SbbChipModule,
    SbbFormFieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'chip', EXAMPLE_INDEX)],
})
export class ChipExamplesModule {}
