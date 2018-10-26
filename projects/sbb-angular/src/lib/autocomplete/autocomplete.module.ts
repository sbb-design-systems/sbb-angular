import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';


import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteOptionComponent } from './autocomplete-option/autocomplete-option.component';
import { AutocompleteOriginDirective } from './autocomplete/autocomplete-origin.directive';
import {
  AutocompleteTriggerDirective
} from './autocomplete/autocomplete-trigger.directive';
import { HighlightPipe } from './autocomplete-option/highlight.pipe';

@NgModule({
  imports: [
    CommonModule,
    A11yModule,
    OverlayModule
  ],
  declarations: [
    AutocompleteComponent,
    AutocompleteOptionComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective,
    HighlightPipe
  ],
  exports: [
    AutocompleteComponent,
    AutocompleteOptionComponent,
    AutocompleteOriginDirective,
    AutocompleteTriggerDirective,
    OverlayModule,
    HighlightPipe
  ]
})
export class AutocompleteModule { }
