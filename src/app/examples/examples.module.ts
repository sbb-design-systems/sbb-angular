import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TextareaModule, FieldModule, LinksModule, RadioButtonModule, CheckboxModule, ButtonModule, IconCommonModule, TabsModule } from 'sbb-angular';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
import { SbbFieldShowcaseComponent } from './sbb-field-showcase/sbb-field-showcase.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { IconComponents } from '../sbb-components-mapping-export';
import { PersonEditComponent } from './tabs-showcase/person/person-edit/person-edit.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent,
    TabsShowcaseComponent,
    PersonEditComponent,
    PersonListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    TextareaModule,
    FieldModule,
    LinksModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot(),
    RadioButtonModule,
    CheckboxModule,
    IconCommonModule.withComponents(IconComponents.types),
    TabsModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    InputFieldShowcaseComponent,
    SbbFieldShowcaseComponent,
    TabsShowcaseComponent,
    PersonEditComponent,
    PersonListComponent
  ]
})
export class ExamplesModule { }
