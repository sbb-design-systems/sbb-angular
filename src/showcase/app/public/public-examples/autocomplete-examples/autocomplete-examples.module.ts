import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { FieldModule } from '@sbb-esta/angular-public/field';

import { provideExamples } from '../../../shared/example-provider';

import { AutocompleteDisplayWithExampleComponent } from './autocomplete-display-with-example/autocomplete-display-with-example.component';
import { AutocompleteFormsExampleComponent } from './autocomplete-forms-example/autocomplete-forms-example.component';
import { AutocompleteHintExampleComponent } from './autocomplete-hint-example/autocomplete-hint-example.component';
import { AutocompleteLocaleNormalizerExampleComponent } from './autocomplete-locale-normalizer-example/autocomplete-locale-normalizer-example.component';
import { AutocompleteOptionGroupExampleComponent } from './autocomplete-option-group-example/autocomplete-option-group-example.component';
import { AutocompleteReactiveFormsExampleComponent } from './autocomplete-reactive-forms-example/autocomplete-reactive-forms-example.component';

const EXAMPLES = [
  AutocompleteDisplayWithExampleComponent,
  AutocompleteFormsExampleComponent,
  AutocompleteHintExampleComponent,
  AutocompleteLocaleNormalizerExampleComponent,
  AutocompleteOptionGroupExampleComponent,
  AutocompleteReactiveFormsExampleComponent,
];

const EXAMPLE_INDEX = {
  'autocomplete-reactive-forms-example': AutocompleteReactiveFormsExampleComponent,
  'autocomplete-forms-example': AutocompleteFormsExampleComponent,
  'autocomplete-hint-example': AutocompleteHintExampleComponent,
  'autocomplete-option-group-example': AutocompleteOptionGroupExampleComponent,
  'autocomplete-display-with-example': AutocompleteDisplayWithExampleComponent,
  'autocomplete-locale-normalizer-example': AutocompleteLocaleNormalizerExampleComponent,
};

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutocompleteModule, FieldModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'autocomplete', EXAMPLE_INDEX)],
})
export class AutocompleteExamplesModule {}
