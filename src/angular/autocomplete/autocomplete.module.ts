import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { SbbCommonModule, SbbOptionModule } from '@sbb-esta/angular/core';

import { SbbAutocomplete } from './autocomplete';
import { SbbAutocompleteOrigin } from './autocomplete-origin';
import { SbbAutocompleteTrigger } from './autocomplete-trigger';

@NgModule({
  imports: [
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
})
export class SbbAutocompleteModule {}
