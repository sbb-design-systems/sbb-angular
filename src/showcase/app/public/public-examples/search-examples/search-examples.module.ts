import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbAutocompleteModule } from '@sbb-esta/angular-public/autocomplete';
import { SbbLoadingModule } from '@sbb-esta/angular-public/loading';
import { SbbSearchModule } from '@sbb-esta/angular-public/search';

import { provideExamples } from '../../../shared/example-provider';

import { SearchAutocompleteExample } from './search-autocomplete-example/search-autocomplete-example.component';
import { SearchCustomIconAutocompleteStaticOptionsExample } from './search-custom-icon-autocomplete-static-options-example/search-custom-icon-autocomplete-static-options-example.component';
import { SearchHistoricRailwayPicturesExample } from './search-historic-railway-pictures-example/search-historic-railway-pictures-example.component';
import { SearchSimpleHeaderModeExample } from './search-simple-header-mode-example/search-simple-header-mode-example.component';
import { SearchSimpleReactiveFormsExample } from './search-simple-reactive-forms-example/search-simple-reactive-forms-example.component';

const EXAMPLES = [
  SearchSimpleReactiveFormsExample,
  SearchSimpleHeaderModeExample,
  SearchAutocompleteExample,
  SearchCustomIconAutocompleteStaticOptionsExample,
  SearchHistoricRailwayPicturesExample,
];

const EXAMPLE_INDEX = {
  'search-simple-reactive-forms-example': SearchSimpleReactiveFormsExample,
  'search-simple-header-mode-example': SearchSimpleHeaderModeExample,
  'search-autocomplete-example': SearchAutocompleteExample,
  'search-custom-icon-autocomplete-static-options-example': SearchCustomIconAutocompleteStaticOptionsExample,
  'search-historic-railway-pictures-example': SearchHistoricRailwayPicturesExample,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbAutocompleteModule,
    SbbLoadingModule,
    SbbSearchModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'search', EXAMPLE_INDEX)],
})
export class SearchExamplesModule {}
