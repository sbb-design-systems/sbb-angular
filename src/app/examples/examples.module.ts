import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TextareaModule, LinksModule, RadioButtonModule, CheckboxModule } from 'sbb-angular';


import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { AutocompleteModule } from 'projects/sbb-angular/src/lib/autocomplete';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    LinksModule,
    AutocompleteModule,
    RadioButtonModule,
    CheckboxModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent
  ]
})
export class ExamplesModule { }
