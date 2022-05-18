import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbAutocompleteModule } from '@sbb-esta/angular/autocomplete';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';
import { SbbSearchModule } from '@sbb-esta/angular/search';

import { SearchAutocompleteExample } from './search-autocomplete/search-autocomplete-example';
import { SearchCustomIconAutocompleteStaticOptionsExample } from './search-custom-icon-autocomplete-static-options/search-custom-icon-autocomplete-static-options-example';
import { SearchHeaderAutocompleteExample } from './search-header-autocomplete/search-header-autocomplete-example';
import { SearchHistoricRailwayPicturesExample } from './search-historic-railway-pictures/search-historic-railway-pictures-example';
import { SearchSimpleHeaderModeExample } from './search-simple-header-mode/search-simple-header-mode-example';
import { SearchSimpleReactiveFormsExample } from './search-simple-reactive-forms/search-simple-reactive-forms-example';

export {
  SearchSimpleReactiveFormsExample,
  SearchSimpleHeaderModeExample,
  SearchAutocompleteExample,
  SearchCustomIconAutocompleteStaticOptionsExample,
  SearchHistoricRailwayPicturesExample,
  SearchHeaderAutocompleteExample,
};

const EXAMPLES = [
  SearchSimpleReactiveFormsExample,
  SearchSimpleHeaderModeExample,
  SearchAutocompleteExample,
  SearchCustomIconAutocompleteStaticOptionsExample,
  SearchHistoricRailwayPicturesExample,
  SearchHeaderAutocompleteExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbAutocompleteModule,
    SbbIconModule,
    SbbLoadingModule,
    SbbSearchModule,
    SbbInputModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class SearchExamplesModule {}
