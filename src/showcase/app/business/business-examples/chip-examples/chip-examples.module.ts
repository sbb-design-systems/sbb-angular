import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '@sbb-esta/angular-business/autocomplete';
import { ChipModule } from '@sbb-esta/angular-business/chip';
import { FieldModule } from '@sbb-esta/angular-business/field';

import { AutocompleteChipInputComponent } from './autocomplete-chip-input/autocomplete-chip-input.component';
import { DisabledChipInputComponent } from './disabled-chip-input/disabled-chip-input.component';
import { FormsChipInputComponent } from './forms-chip-input/forms-chip-input.component';
import { ReactiveFormsChipInputComponent } from './reactive-forms-chip-input/reactive-forms-chip-input.component';

const EXAMPLES = [
  AutocompleteChipInputComponent,
  DisabledChipInputComponent,
  FormsChipInputComponent,
  ReactiveFormsChipInputComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutocompleteModule,
    ChipModule,
    FieldModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ChipExamplesModule {}
