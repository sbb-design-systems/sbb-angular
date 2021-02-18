import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbOptionModule } from '@sbb-esta/angular/core';

import { SbbAutocomplete } from './autocomplete';
import { SbbAutocompleteHint } from './autocomplete-hint';
import { SbbAutocompleteOrigin } from './autocomplete-origin';
import {
  SbbAutocompleteTrigger,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './autocomplete-trigger';

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
