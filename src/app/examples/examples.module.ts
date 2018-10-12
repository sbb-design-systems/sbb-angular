import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';

import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
// tslint:disable-next-line
import { DocumentationImportInputFieldComponent } from './input-field-showcase/documentation/import/documentation-import-input-field.component';
// tslint:disable-next-line
import { DocumentationSourceInputFieldComponent } from './input-field-showcase/documentation/source/documentation-source-input-field.component';
// tslint:disable-next-line
import { DocumentationGettingStartedInputFieldComponent } from './input-field-showcase/documentation/getting-started/documentation-getting-started-input-field.component';
// tslint:disable-next-line
import { DocumentationPropertiesInputFieldComponent } from './input-field-showcase/documentation/properties/documentation-properties-input-field.component';
// tslint:disable-next-line
import { DocumentationModelBindingInputFieldComponent } from './input-field-showcase/documentation/model-binding/documentation-model-binding-input-field.component';
// tslint:disable-next-line
import { DocumentationStylingInputFieldComponent } from './input-field-showcase/documentation/styling/documentation-styling-input-field.component';
// tslint:disable-next-line
import { DocumentationDependenciesInputFieldComponent } from './input-field-showcase/documentation/dependencies/documentation-dependencies-input-field.component';
// tslint:disable-next-line
import { DocumentationEventsInputFieldComponent } from './input-field-showcase/documentation/events/documentation-events-input-field.component';
// tslint:disable-next-line
import { DocumentationAutoResizeInputFieldComponent } from './input-field-showcase/documentation/auto-resize/documentation-auto-resize-input-field.component';
// tslint:disable-next-line
import { DocumentationIconsInputFieldComponent } from './input-field-showcase/documentation/icons/documentation-icons-input-field.component';

import { SbbFieldShowcaseComponent } from './sbb-field-showcase/sbb-field-showcase.component';
// tslint:disable-next-line
import { DocumentationImportSbbFieldComponent } from './sbb-field-showcase/documentation/import/documentation-import-sbb-field.component';
// tslint:disable-next-line
import { DocumentationSourceSbbFieldComponent } from './sbb-field-showcase/documentation/source/documentation-source-sbb-field.component';
// tslint:disable-next-line
import { DocumentationGettingStartedSbbFieldComponent } from './sbb-field-showcase/documentation/getting-started/documentation-getting-started-sbb-field.component';
// tslint:disable-next-line
import { DocumentationPropertiesSbbFieldComponent } from './sbb-field-showcase/documentation/properties/documentation-properties-sbb-field.component';
// tslint:disable-next-line
import { DocumentationModelBindingSbbFieldComponent } from './sbb-field-showcase/documentation/model-binding/documentation-model-binding-sbb-field.component';
// tslint:disable-next-line
import { DocumentationStylingSbbFieldComponent } from './sbb-field-showcase/documentation/styling/documentation-styling-sbb-field.component';
// tslint:disable-next-line
import { DocumentationDependenciesSbbFieldComponent } from './sbb-field-showcase/documentation/dependencies/documentation-dependencies-sbb-field.component';
// tslint:disable-next-line
import { DocumentationEventsSbbFieldComponent } from './sbb-field-showcase/documentation/events/documentation-events-sbb-field.component';
// tslint:disable-next-line
import { DocumentationAutoResizeSbbFieldComponent } from './sbb-field-showcase/documentation/auto-resize/documentation-auto-resize-sbb-input-field.component';
// tslint:disable-next-line
import { DocumentationIconsSbbFieldComponent } from './sbb-field-showcase/documentation/icons/documentation-icons-sbb-field.component';

import { TextareaModule, TextInputModule, LinksModule } from 'sbb-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TextareaShowcaseComponent,
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
    imports: [
        BrowserModule,
        CommonModule,
        TextareaModule,
        TextInputModule,
        LinksModule,
        FormsModule,
        ReactiveFormsModule,
        MonacoEditorModule.forRoot()
    ],
    providers: [],
    exports: [TextareaShowcaseComponent,
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
              DocumentationIconsSbbFieldComponent]
})
export class ExamplesModule { }
