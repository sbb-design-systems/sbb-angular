import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';


import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { OptionComponent } from './option/option.component';
import { AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
import {
  AutocompleteTriggerDirective
} from './autocomplete/autocomplete-trigger.directive';
import { HighlightPipe } from './option/highlight.pipe';

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
    HighlightPipe
  ],
  exports: [
    AutocompleteComponent,
    OptionComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective,
    OverlayModule,
    HighlightPipe
  ]
})
export class AutocompleteModule { }
