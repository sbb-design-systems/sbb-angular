import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule, LinksModule, AutocompleteModule } from 'sbb-angular';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    LinksModule,
    AutocompleteModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent
  ]
})
export class ExamplesModule { }
