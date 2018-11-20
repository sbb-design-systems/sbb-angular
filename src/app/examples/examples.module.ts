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
  ButtonModule,
  AutocompleteModule
} from 'sbb-angular';

import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';
import { IconComponents } from '../sbb-components-mapping-export';
import { InputFieldShowcaseComponent } from './text-input-showcase/text-input-showcase.component';
import { SbbFieldShowcaseComponent } from './field-showcase/field-showcase.component';
import { DatepickerShowcaseComponent } from './datepicker-showcase/datepicker-showcase.component';
import { DatepickerModule, DateAdapter, SBB_DATE_FORMATS } from 'projects/sbb-angular/src/public_api';
import { DateFnsAdapter } from 'projects/sbb-angular/src/lib/datepicker/date-fns-adapter';
import { SBB_SIMPLE_DATE_FORMATS } from 'projects/sbb-angular/src/lib/datepicker/simple-date-formats';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent,
    DatepickerShowcaseComponent
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
    DatepickerModule,
    IconCommonModule.withComponents(IconComponents.types)
  ],
  providers: [{ provide: DateAdapter, useClass: DateFnsAdapter },
    {provide: SBB_DATE_FORMATS, useValue: SBB_SIMPLE_DATE_FORMATS}
  ],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent,
    DatepickerShowcaseComponent,
    ButtonModule
  ],

})
export class ExamplesModule { }
