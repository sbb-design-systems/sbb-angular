import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { FieldModule } from '@sbb-esta/angular-public/field';

import { AutocompleteFormsExampleComponent } from './autocomplete-forms-example/autocomplete-forms-example.component';
import { AutocompleteHintExampleComponent } from './autocomplete-hint-example/autocomplete-hint-example.component';
import { AutocompleteOptionGroupExampleComponent } from './autocomplete-option-group-example/autocomplete-option-group-example.component';
import { AutocompleteReactiveFormsExampleComponent } from './autocomplete-reactive-forms-example/autocomplete-reactive-forms-example.component';

const EXAMPLES = [
  AutocompleteFormsExampleComponent,
  AutocompleteHintExampleComponent,
  AutocompleteOptionGroupExampleComponent,
  AutocompleteReactiveFormsExampleComponent
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutocompleteModule, FieldModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class AutocompleteExamplesModule {}
