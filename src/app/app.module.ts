import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search-component/search.component';
import { NavlistComponent } from './navlist-component/navlist.component';
import { SearchIconComponent } from './search-icon/search-icon.component';
import { NavlistIconComponent } from './navlist-icon/navlist-icon.component';
import { ContentComponent } from './content/content.component';

import { MonacoEditorModule } from 'ngx-monaco-editor';
import { IconCommonModule } from 'sbb-angular';
import { IconViewerDirective } from './directives/icon-viewer.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ReplacePipe } from './shared/replace.pipe';
import { IconComponents } from './sbb-components-mapping-export';
import { ComponentViewerDirective } from './directives/component-viewer.directive';
import { ExamplesModule } from './examples/examples.module';

import { TextareaShowcaseComponent } from './examples/textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './examples/links-showcase/links-showcase.component';

import { InputFieldShowcaseComponent } from './examples/input-field-showcase/input-field-showcase.component';
// tslint:disable-next-line
import { DocumentationSourceInputFieldComponent } from './examples/input-field-showcase/documentation/source/documentation-source-input-field.component';
// tslint:disable-next-line
import { DocumentationImportInputFieldComponent } from './examples/input-field-showcase/documentation/import/documentation-import-input-field.component';
// tslint:disable-next-line
import { DocumentationGettingStartedInputFieldComponent } from './examples/input-field-showcase/documentation/getting-started/documentation-getting-started-input-field.component';
// tslint:disable-next-line
import { DocumentationPropertiesInputFieldComponent } from './examples/input-field-showcase/documentation/properties/documentation-properties-input-field.component';
// tslint:disable-next-line
import { DocumentationModelBindingInputFieldComponent } from './examples/input-field-showcase/documentation/model-binding/documentation-model-binding-input-field.component';
// tslint:disable-next-line
import { DocumentationStylingInputFieldComponent } from './examples/input-field-showcase/documentation/styling/documentation-styling-input-field.component';
// tslint:disable-next-line
import { DocumentationDependenciesInputFieldComponent } from './examples/input-field-showcase/documentation/dependencies/documentation-dependencies-input-field.component';
// tslint:disable-next-line
import { DocumentationEventsInputFieldComponent } from './examples/input-field-showcase/documentation/events/documentation-events-input-field.component';
// tslint:disable-next-line
import { DocumentationAutoResizeInputFieldComponent } from './examples/input-field-showcase/documentation/auto-resize/documentation-auto-resize-input-field.component';
// tslint:disable-next-line
import { DocumentationIconsInputFieldComponent } from './examples/input-field-showcase/documentation/icons/documentation-icons-input-field.component';

import { SbbFieldShowcaseComponent } from './examples/sbb-field-showcase/sbb-field-showcase.component';
// tslint:disable-next-line
import { DocumentationImportSbbFieldComponent } from './examples/sbb-field-showcase/documentation/import/documentation-import-sbb-field.component';
// tslint:disable-next-line
import { DocumentationSourceSbbFieldComponent } from './examples/sbb-field-showcase/documentation/source/documentation-source-sbb-field.component';
// tslint:disable-next-line
import { DocumentationGettingStartedSbbFieldComponent } from './examples/sbb-field-showcase/documentation/getting-started/documentation-getting-started-sbb-field.component';
// tslint:disable-next-line
import { DocumentationPropertiesSbbFieldComponent } from './examples/sbb-field-showcase/documentation/properties/documentation-properties-sbb-field.component';
// tslint:disable-next-line
import { DocumentationModelBindingSbbFieldComponent } from './examples/sbb-field-showcase/documentation/model-binding/documentation-model-binding-sbb-field.component';
// tslint:disable-next-line
import { DocumentationStylingSbbFieldComponent } from './examples/sbb-field-showcase/documentation/styling/documentation-styling-sbb-field.component';
// tslint:disable-next-line
import { DocumentationDependenciesSbbFieldComponent } from './examples/sbb-field-showcase/documentation/dependencies/documentation-dependencies-sbb-field.component';
// tslint:disable-next-line
import { DocumentationEventsSbbFieldComponent } from './examples/sbb-field-showcase/documentation/events/documentation-events-sbb-field.component';
// tslint:disable-next-line
import { DocumentationAutoResizeSbbFieldComponent } from './examples/sbb-field-showcase/documentation/auto-resize/documentation-auto-resize-sbb-input-field.component';
// tslint:disable-next-line
import { DocumentationIconsSbbFieldComponent } from './examples/sbb-field-showcase/documentation/icons/documentation-icons-sbb-field.component';

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
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    NgbModule,
    MonacoEditorModule.forRoot({baseUrl: './assets'}),
    AppRoutingModule,
    IconCommonModule.withComponents(IconComponents.types),
    ExamplesModule
  ],
  schemas: [],
  providers: [],
  entryComponents: [TextareaShowcaseComponent,
                    LinksShowcaseComponent,
                    InputFieldShowcaseComponent,
                    DocumentationImportInputFieldComponent,
                    DocumentationSourceInputFieldComponent,
                    DocumentationGettingStartedInputFieldComponent,
                    DocumentationPropertiesInputFieldComponent,
                    DocumentationModelBindingInputFieldComponent,
                    DocumentationStylingInputFieldComponent,
                    DocumentationDependenciesInputFieldComponent,
                    DocumentationEventsInputFieldComponent,
                    DocumentationAutoResizeInputFieldComponent,
                    DocumentationIconsInputFieldComponent,
                    SbbFieldShowcaseComponent,
                    DocumentationImportSbbFieldComponent,
                    DocumentationSourceSbbFieldComponent,
                    DocumentationGettingStartedSbbFieldComponent,
                    DocumentationPropertiesSbbFieldComponent,
                    DocumentationModelBindingSbbFieldComponent,
                    DocumentationStylingSbbFieldComponent,
                    DocumentationDependenciesSbbFieldComponent,
                    DocumentationEventsSbbFieldComponent,
                    DocumentationAutoResizeSbbFieldComponent,
                    DocumentationIconsSbbFieldComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
