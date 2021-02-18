import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbOptionModule } from '@sbb-esta/angular/core';

import { SbbAutocompleteHint } from './autocomplete-hint/autocomplete-hint';
import { SbbAutocomplete } from './autocomplete/autocomplete';
import { SbbAutocompleteOrigin } from './autocomplete/autocomplete-origin';
import {
  SbbAutocompleteTrigger,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './autocomplete/autocomplete-trigger';

@NgModule({
  imports: [SbbOptionModule, CommonModule, A11yModule, OverlayModule],
  declarations: [
    SbbAutocomplete,
    SbbAutocompleteOrigin,
    SbbAutocompleteTrigger,
    SbbAutocompleteHint,
  ],
  exports: [
    SbbOptionModule,
    OverlayModule,
    SbbAutocomplete,
    SbbAutocompleteOrigin,
    SbbAutocompleteTrigger,
    SbbAutocompleteHint,
  ],
  providers: [SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbAutocompleteModule {}
