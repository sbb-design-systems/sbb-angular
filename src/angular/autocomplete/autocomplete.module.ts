import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule, SbbOptionModule } from '@sbb-esta/angular/core';

import { SbbAutocomplete } from './autocomplete';
import { SbbAutocompleteOrigin } from './autocomplete-origin';
import {
  SbbAutocompleteTrigger,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER,
} from './autocomplete-trigger';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    OverlayModule,
    SbbCommonModule,
    SbbOptionModule,
    SbbAutocomplete,
    SbbAutocompleteOrigin,
    SbbAutocompleteTrigger,
  ],
  exports: [
    SbbOptionModule,
    OverlayModule,
    SbbAutocomplete,
    SbbAutocompleteOrigin,
    SbbAutocompleteTrigger,
  ],
  providers: [SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbAutocompleteModule {}
