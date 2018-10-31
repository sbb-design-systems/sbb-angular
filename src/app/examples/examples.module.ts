import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { MonacoEditorModule } from 'ngx-monaco-editor';

import {
  IconCommonModule,
  TextareaModule,
  FieldModule,
  LinksModule,
  RadioButtonModule,
  CheckboxModule,
  AutocompleteModule,
  ButtonModule
} from 'sbb-angular';

import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
import { SbbFieldShowcaseComponent } from './sbb-field-showcase/sbb-field-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';
import { IconComponents } from '../sbb-components-mapping-export';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    TextareaModule,
    FieldModule,
    LinksModule,
    AutocompleteModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot(),
    RadioButtonModule,
    CheckboxModule,
    IconCommonModule.withComponents(IconComponents.types)
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent
  ]
})
export class ExamplesModule { }
