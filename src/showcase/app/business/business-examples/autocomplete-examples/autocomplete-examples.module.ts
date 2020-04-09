import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AutocompleteModule } from '@sbb-esta/angular-business/autocomplete';

const EXAMPLES = [];

@NgModule({
  imports: [CommonModule, AutocompleteModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES
})
export class AutocompleteExamplesModule {}
