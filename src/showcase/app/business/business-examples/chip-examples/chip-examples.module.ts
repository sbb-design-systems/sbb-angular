import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '@sbb-esta/angular-business/autocomplete';
import { ChipModule } from '@sbb-esta/angular-business/chip';
import { FieldModule } from '@sbb-esta/angular-business/field';

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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteModule,
    ChipModule,
    FieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class ChipExamplesModule {}
