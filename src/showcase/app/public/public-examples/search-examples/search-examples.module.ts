import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { AutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { LoadingModule } from '@sbb-esta/angular-public/loading';
import { SearchModule } from '@sbb-esta/angular-public/search';

import { provideExamples } from '../../../shared/example-provider';

import { SearchExampleComponent } from './search-example/search-example.component';

const EXAMPLES = [SearchExampleComponent];

const EXAMPLE_INDEX = {
  'search-example': SearchExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    AutocompleteModule,
    LoadingModule,
    SearchModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'search', EXAMPLE_INDEX)],
})
export class SearchExamplesModule {}
