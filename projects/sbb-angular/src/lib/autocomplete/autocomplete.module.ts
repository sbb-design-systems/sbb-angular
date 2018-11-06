import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';


import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { OptionComponent } from './option/option.component';
import { AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
import {
  AutocompleteTriggerDirective, SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER
} from './autocomplete/autocomplete-trigger.directive';
import { HighlightPipe } from './option/highlight.pipe';
import { OptionGroupComponent } from './option-group/option-group.component';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    OverlayModule
  ],
  declarations: [
    AutocompleteComponent,
    OptionComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective,
    HighlightPipe,
    OptionGroupComponent
  ],
  exports: [
    AutocompleteComponent,
    OptionComponent,
    OptionGroupComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective,
    OverlayModule,
    HighlightPipe
  ],
  providers: [SBB_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER]
})
export class AutocompleteModule { }
