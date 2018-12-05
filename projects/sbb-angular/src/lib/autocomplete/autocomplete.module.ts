import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';


import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
import {
  AutocompleteTriggerDirective, SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './autocomplete/autocomplete-trigger.directive';
import { OptionModule } from '../option/option.module';


@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    OverlayModule,
    OptionModule
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
