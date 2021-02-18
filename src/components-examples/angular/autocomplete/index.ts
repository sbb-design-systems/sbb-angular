import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

import { AutocompleteDisplayWithExample } from './autocomplete-display-with/autocomplete-display-with-example';
import { AutocompleteFormsExample } from './autocomplete-forms/autocomplete-forms-example';
import { AutocompleteHintExample } from './autocomplete-hint/autocomplete-hint-example';
import { AutocompleteLocaleNormalizerExample } from './autocomplete-locale-normalizer/autocomplete-locale-normalizer-example';
import { AutocompleteOptionGroupExample } from './autocomplete-option-group/autocomplete-option-group-example';
import { AutocompleteReactiveFormsExample } from './autocomplete-reactive-forms/autocomplete-reactive-forms-example';

export {
  AutocompleteDisplayWithExample,
  AutocompleteFormsExample,
  AutocompleteHintExample,
  AutocompleteLocaleNormalizerExample,
  AutocompleteOptionGroupExample,
  AutocompleteReactiveFormsExample,
};

const EXAMPLES = [
  AutocompleteDisplayWithExample,
  AutocompleteFormsExample,
  AutocompleteHintExample,
  AutocompleteLocaleNormalizerExample,
  AutocompleteOptionGroupExample,
  AutocompleteReactiveFormsExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbAutocompleteModule,
    SbbFormFieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class AutocompleteExamplesModule {}
