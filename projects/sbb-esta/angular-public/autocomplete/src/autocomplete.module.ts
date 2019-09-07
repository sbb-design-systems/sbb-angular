import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OptionModule } from '@sbb-esta/angular-public/option';

import { AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
import {
  AutocompleteTriggerDirective,
  SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './autocomplete/autocomplete-trigger.directive';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

@NgModule({
  imports: [OptionModule, CommonModule, A11yModule, OverlayModule],
  declarations: [AutocompleteComponent, AutocompleteOriginDirective, AutocompleteTriggerDirective],
  exports: [
    OptionModule,
    OverlayModule,
    AutocompleteComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective
  ],
  providers: [SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class AutocompleteModule {}
