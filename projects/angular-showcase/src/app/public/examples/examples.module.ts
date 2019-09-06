import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';

import { MonacoEditorModule } from 'ngx-monaco-editor';

import { IconCollectionModule } from '@sbb-esta/angular-icons';
import {
  AccordionModule,
  AutocompleteModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CaptchaModule,
  CheckboxModule,
  CheckboxPanelModule,
  DatepickerModule,
  DropdownModule,
  FieldModule,
  FileSelectorModule,
  GhettoboxModule,
  LightboxModule,
  LinksModule,
  LoadingModule,
  NotificationsModule,
  OptionModule,
  PaginationModule,
  ProcessflowModule,
  RadioButtonModule,
  RadioButtonPanelModule,
  SearchModule,
  SelectModule,
  TableModule,
  TabsModule,
  TagModule,
  TextareaModule,
  TextexpandModule,
  TimeInputModule,
  ToggleModule,
  TooltipModule,
  UserMenuModule
} from '@sbb-esta/angular-public';

import { AccordionShowcaseComponent } from './accordion-showcase/accordion-showcase.component';
import { AutocompleteShowcaseComponent } from './autocomplete-showcase/autocomplete-showcase.component';
import { BadgeShowcaseComponent } from './badge-showcase/badge-showcase.component';
import { BreadcrumbShowcaseComponent } from './breadcrumb-showcase/breadcrumb-showcase.component';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';
import { CaptchaShowcaseComponent } from './captcha-showcase/captcha-showcase.component';
import { CheckboxPanelShowcaseComponent } from './checkbox-panel-showcase/checkbox-panel-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';
import { DatepickerShowcaseComponent } from './datepicker-showcase/datepicker-showcase.component';
import { DropdownShowcaseComponent } from './dropdown-showcase/dropdown-showcase.component';
import { FieldShowcaseComponent } from './field-showcase/field-showcase.component';
import { FileSelectorShowcaseComponent } from './file-selector-showcase/file-selector-showcase.component';
import { GhettoboxShowcaseComponent } from './ghettobox-showcase/ghettobox-showcase.component';
import {
  LightboxShowcaseComponent,
  LightboxShowcaseExample2Component,
  LightboxShowcaseExample2ContentComponent,
  LightboxShowcaseExample3Component,
  LightboxShowcaseExample4Component,
  LightboxShowcaseExample4ContentComponent,
  LightboxShowcaseExample5Component,
  LightboxShowcaseExample5ContentComponent,
  LightboxShowcaseExample6ContentComponent,
  LightboxShowcaseExampleComponent,
  LightboxShowcaseExampleContentComponent
} from './lightbox-showcase/lightbox-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { LoadingShowcaseComponent } from './loading-showcase/loading-showcase.component';
import { NotificationShowcaseComponent } from './notification-showcase/notification-showcase.component';
import { PaginationShowcaseComponent } from './pagination-showcase/pagination-showcase.component';
import { ProcessflowShowcaseComponent } from './processflow-showcase/processflow-showcase.component';
import { RadioButtonPanelShowcaseComponent } from './radio-button-panel-showcase/radio-button-panel-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { SearchShowcaseComponent } from './search-showcase/search-showcase.component';
import { SelectShowcaseComponent } from './select-showcase/select-showcase.component';
import { TableShowcaseComponent } from './table-showcase/table-showcase.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import { TagShowcaseComponent } from './tag-showcase/tag-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { TextexpandShowcaseComponent } from './textexpand-showcase/textexpand-showcase.component';
import { TimeInputShowcaseComponent } from './time-input-showcase/time-input-showcase.component';
import { ToggleShowcaseComponent } from './toggle-showcase/toggle-showcase.component';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { UserMenuShowcaseComponent } from './usermenu-showcase/usermenu-showcase.component';

const exampleComponents = [
  AccordionShowcaseComponent,
  AutocompleteShowcaseComponent,
  BadgeShowcaseComponent,
  BreadcrumbShowcaseComponent,
  ButtonShowcaseComponent,
  CaptchaShowcaseComponent,
  CheckboxPanelShowcaseComponent,
  CheckboxShowcaseComponent,
  DatepickerShowcaseComponent,
  DropdownShowcaseComponent,
  FieldShowcaseComponent,
  FileSelectorShowcaseComponent,
  GhettoboxShowcaseComponent,
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
  LinksShowcaseComponent,
  LoadingShowcaseComponent,
  NotificationShowcaseComponent,
  PaginationShowcaseComponent,
  PersonListComponent,
  ProcessflowShowcaseComponent,
  RadioButtonPanelShowcaseComponent,
  RadioButtonShowcaseComponent,
  SearchShowcaseComponent,
  SelectShowcaseComponent,
  TableShowcaseComponent,
  TabsShowcaseComponent,
  TextareaShowcaseComponent,
  TextexpandShowcaseComponent,
  TimeInputShowcaseComponent,
  ToggleShowcaseComponent,
  TooltipShowcaseComponent,
  TagShowcaseComponent,
  UserMenuShowcaseComponent
];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
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
    IconCollectionModule,
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
    SearchModule,
    FileSelectorModule,
    DropdownModule,
    CaptchaModule,
    BreadcrumbModule,
    UserMenuModule,
    GhettoboxModule,
    BadgeModule,
    AutocompleteModule
  ]
})
export class ExamplesModule {}
