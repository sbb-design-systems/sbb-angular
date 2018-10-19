import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';


import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { AutocompleteOptionComponent } from './autocomplete-option/autocomplete-option.component';
import { AutocompleteOptionListComponent } from './autocomplete-option-list/autocomplete-option-list.component';
import { FilterPipe } from './autocomplete-option-list/autocomplete-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    A11yModule
  ],
  declarations: [AutocompleteComponent, AutocompleteOptionComponent, AutocompleteOptionListComponent, FilterPipe],
  exports: [AutocompleteComponent, AutocompleteOptionComponent, AutocompleteOptionListComponent, FilterPipe]
})
export class AutocompleteModule { }
