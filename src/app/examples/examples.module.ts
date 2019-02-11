import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { MonacoEditorModule } from 'ngx-monaco-editor';

import {
  IconCommonModule,
  TextareaModule,
  FieldModule,
  LinksModule,
  ButtonModule,
  TabsModule,
  TimeInputModule,
  LoadingModule,
  DatepickerModule,
  LightboxModule,
  AutocompleteModule,
  SelectModule,
  OptionModule,
  AccordionModule,
  ProcessflowModule,
  RadioButtonModule,
  NotificationsModule,
  TableModule,
  RadioButtonPanelModule,
  CheckboxPanelModule,
  TooltipModule,
  TextexpandModule,
  CheckboxModule,
  TagModule,
  ToggleModule,
  PaginationModule
} from 'sbb-angular';

import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';
import { TimeInputShowcaseComponent } from './time-input-showcase/time-input-showcase.component';
import { FieldShowcaseComponent } from './field-showcase/field-showcase.component';
import { DatepickerShowcaseComponent } from './datepicker-showcase/datepicker-showcase.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';
import { LoadingShowcaseComponent } from './loading-showcase/loading-showcase.component';
import {
  LightboxShowcaseComponent,
  LightboxShowcaseExampleComponent,
  LightboxShowcaseExampleContentComponent,
  LightboxShowcaseExample2Component,
  LightboxShowcaseExample2ContentComponent,
  LightboxShowcaseExample3Component,
  LightboxShowcaseExample4Component,
  LightboxShowcaseExample4ContentComponent,
  LightboxShowcaseExample5Component,
  LightboxShowcaseExample5ContentComponent,
  LightboxShowcaseExample6ContentComponent
} from './lightbox-showcase/lightbox-showcase.component';
import { SelectShowcaseComponent } from './select-showcase/select-showcase.component';
import { AccordionShowcaseComponent } from './accordion-showcase/accordion-showcase.component';
import { ProcessflowShowcaseComponent } from './processflow-showcase/processflow-showcase.component';
import { RadioButtonPanelShowcaseComponent } from './radio-button-panel-showcase/radio-button-panel-showcase.component';
import { CheckboxPanelShowcaseComponent } from './checkbox-panel-showcase/checkbox-panel-showcase.component';
import { NotificationShowcaseComponent } from './notification-showcase/notification-showcase.component';
import { TableShowcaseComponent } from './table-showcase/table-showcase.component';
import { ToggleShowcaseComponent } from './toggle-showcase/toggle-showcase.component';
import { PaginationShowcaseComponent } from './pagination-showcase/pagination-showcase.component';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { TextexpandShowcaseComponent } from './textexpand-showcase/textexpand-showcase.component';
import { TagShowcaseComponent } from './tag-showcase/tag-showcase.component';
import { FileSelectorShowcaseComponent } from './file-selector-showcase/file-selector-showcase.component';


import { FileSelectorModule } from 'projects/sbb-angular/src/lib/file-selector/file-selector';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    DatepickerShowcaseComponent,
    FieldShowcaseComponent,
    TabsShowcaseComponent,
    PersonListComponent,
    TimeInputShowcaseComponent,
    LoadingShowcaseComponent,
    LightboxShowcaseComponent,
    LightboxShowcaseExampleComponent,
    LightboxShowcaseExampleContentComponent,
    LightboxShowcaseExample2Component,
    LightboxShowcaseExample2ContentComponent,
    LightboxShowcaseExample3Component,
    LightboxShowcaseExample4Component,
    LightboxShowcaseExample4ContentComponent,
    LightboxShowcaseExample5Component,
    LightboxShowcaseExample5ContentComponent,
    LightboxShowcaseExample6ContentComponent,
    SelectShowcaseComponent,
    AccordionShowcaseComponent,
    ProcessflowShowcaseComponent,
    RadioButtonPanelShowcaseComponent,
    CheckboxPanelShowcaseComponent,
    NotificationShowcaseComponent,
    TableShowcaseComponent,
    ToggleShowcaseComponent,
    PaginationShowcaseComponent,
    TooltipShowcaseComponent,
    TextexpandShowcaseComponent,
    TagShowcaseComponent,
    FileSelectorShowcaseComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    TextareaModule,
    FieldModule,
    LinksModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule.forRoot(),
    RadioButtonModule,
    CheckboxModule,
    DatepickerModule,
    TimeInputModule,
    IconCommonModule,
    TabsModule,
    LoadingModule,
    LightboxModule,
    OptionModule,
    AutocompleteModule,
    SelectModule,
    AccordionModule,
    ProcessflowModule,
    RadioButtonPanelModule,
    CheckboxPanelModule,
    NotificationsModule,
    TableModule,
    ToggleModule,
    PaginationModule,
    TooltipModule,
    TextexpandModule,
    TagModule,
    FileSelectorModule
  ],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    AutocompleteShowcaseComponent,
    ButtonShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent,
    DatepickerShowcaseComponent,
    FieldShowcaseComponent,
    TabsShowcaseComponent,
    PersonListComponent,
    TimeInputShowcaseComponent,
    SelectShowcaseComponent,
    ProcessflowShowcaseComponent,
    RadioButtonPanelShowcaseComponent,
    CheckboxPanelShowcaseComponent,
    NotificationShowcaseComponent,
    PaginationShowcaseComponent,
    TextexpandShowcaseComponent,
    ButtonModule,
    LoadingModule,
    LightboxModule,
    OptionModule,
    AccordionModule,
    TableModule,
    TooltipShowcaseComponent
  ],
  entryComponents: [
    LightboxShowcaseExampleContentComponent,
    LightboxShowcaseExample2ContentComponent,
    LightboxShowcaseExample4ContentComponent,
    LightboxShowcaseExample5ContentComponent,
    LightboxShowcaseExample6ContentComponent
  ]
})
export class ExamplesModule { }
