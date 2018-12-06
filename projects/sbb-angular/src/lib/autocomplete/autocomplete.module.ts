import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';

import { OptionModule } from '../option/option.module';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
import {
  AutocompleteTriggerDirective, SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './autocomplete/autocomplete-trigger.directive';


@NgModule({
  imports: [
    OptionModule,
    CommonModule,
    A11yModule,
    OverlayModule
  ],
  declarations: [
    AutocompleteComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective
  ],
  exports: [
    AutocompleteComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective,
    OverlayModule,
    OptionModule
  ],
  providers: [SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class AutocompleteModule { }
