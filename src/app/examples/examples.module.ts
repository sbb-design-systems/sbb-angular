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
  ButtonModule,
  TabsModule,
  TabsNewModule
} from 'sbb-angular';

import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
import { SbbFieldShowcaseComponent } from './sbb-field-showcase/sbb-field-showcase.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import { TabsShowcaseNewComponent } from './tabs-new-showcase/tabs-showcase-new.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';
import { IconComponents } from '../sbb-components-mapping-export';
import { PersonEditComponent } from './tabs-showcase/person/person-edit/person-edit.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';
import { PersonEditNewComponent } from './tabs-new-showcase/person-new/person-edit-new/person-edit-new.component';
import { PersonListNewComponent } from './tabs-new-showcase/person-new/person-list-new/person-list-new.component';

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
    TabsShowcaseComponent,
    PersonEditComponent,
    PersonListComponent,
    TabsShowcaseNewComponent,
    PersonEditNewComponent,
    PersonListNewComponent
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
    IconCommonModule.withComponents(IconComponents.types),
    TabsModule,
    TabsNewModule
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
    SbbFieldShowcaseComponent,
    TabsShowcaseComponent,
    PersonEditComponent,
    PersonListComponent,
    TabsShowcaseNewComponent,
    PersonEditNewComponent,
    PersonListNewComponent
  ]
})
export class ExamplesModule { }
