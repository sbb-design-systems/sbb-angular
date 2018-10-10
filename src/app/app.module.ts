import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search-component/search.component';
import { NavlistComponent } from './navlist-component/navlist.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { NavlistIconComponent } from './navlist-icon/navlist-icon.component';
import { ContentComponent } from './content/content.component';

import { ComponentUiService } from './services/component-ui.service';
import { IconUiService } from './services/icon-ui.service';
import { AccordionNotificationService } from './services/accordion-notification.service';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { IconCommonModule } from 'sbb-angular';
import { IconViewerDirective } from './directives/icon-viewer.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReplacePipe } from './shared/replace.pipe';
import { IconComponents } from './sbb-components-mapping-export';
import { ComponentViewerDirective } from './directives/component-viewer.directive';
import { ExamplesModule } from './examples/examples.module';
import { TextareaShowcaseComponent } from './examples/textarea-showcase/textarea-showcase.component';

import { InputFieldShowcaseComponent } from './examples/input-field-showcase/input-field-showcase.component';
import { DocumentationSourceInputFieldComponent } from './examples/input-field-showcase/documentation/source/documentation-source-input-field.component';
import { DocumentationImportInputFieldComponent } from './examples/input-field-showcase/documentation/import/documentation-import-input-field.component';
import { DocumentationGettingStartedInputFieldComponent } from './examples/input-field-showcase/documentation/gettingStarted/documentation-gettingStarted-input-field.component';

import { SbbFieldShowcaseComponent } from './examples/sbb-field-showcase/sbb-field-showcase.component';
import { DocumentationImportSbbFieldComponent } from './examples/sbb-field-showcase/documentation/import/documentation-import-sbb-field.component';
import { DocumentationSourceSbbFieldComponent } from './examples/sbb-field-showcase/documentation/source/documentation-source-sbb-field.component';
import { DocumentationGettingStartedSbbFieldComponent } from './examples/sbb-field-showcase/documentation/gettingStarted/documentation-gettingStarted-sbb-field.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavlistComponent,
    ContentComponent,
    HomeComponent,
    IconViewerDirective,
    ComponentViewerDirective,
    NavlistIconComponent,
    SearchIconComponent,
    ReplacePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MonacoEditorModule.forRoot(),
    AppRoutingModule,
    IconCommonModule.withComponents(IconComponents.types),
    ExamplesModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  providers: [ComponentUiService, IconUiService, AccordionNotificationService],
  entryComponents: [TextareaShowcaseComponent, 
                    InputFieldShowcaseComponent,
                    DocumentationImportInputFieldComponent,
                    DocumentationSourceInputFieldComponent,
                    DocumentationGettingStartedInputFieldComponent,
                    SbbFieldShowcaseComponent,
                    DocumentationImportSbbFieldComponent,
                    DocumentationSourceSbbFieldComponent,
                    DocumentationGettingStartedSbbFieldComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
