import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';

import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
import { DocumentationImportInputFieldComponent } from './input-field-showcase/documentation/import/documentation-import-input-field.component';
import { DocumentationSourceInputFieldComponent } from './input-field-showcase/documentation/source/documentation-source-input-field.component';
import { DocumentationGettingStartedInputFieldComponent } from './input-field-showcase/documentation/gettingStarted/documentation-gettingStarted-input-field.component';

import { SbbFieldShowcaseComponent } from './sbb-field-showcase/sbb-field-showcase.component';
import { DocumentationImportSbbFieldComponent } from './sbb-field-showcase/documentation/import/documentation-import-sbb-field.component';
import { DocumentationSourceSbbFieldComponent } from './sbb-field-showcase/documentation/source/documentation-source-sbb-field.component';
import { DocumentationGettingStartedSbbFieldComponent } from './sbb-field-showcase/documentation/gettingStarted/documentation-gettingStarted-sbb-field.component';

import { TextareaModule, TextInputModule } from 'sbb-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [TextareaShowcaseComponent, 
                   InputFieldShowcaseComponent,
                   DocumentationImportInputFieldComponent,
                   DocumentationSourceInputFieldComponent,
                   DocumentationGettingStartedInputFieldComponent,
                   SbbFieldShowcaseComponent,
                   DocumentationImportSbbFieldComponent,
                   DocumentationSourceSbbFieldComponent,
                   DocumentationGettingStartedSbbFieldComponent],
    imports: [
        BrowserModule,
        CommonModule,
        TextareaModule,
        TextInputModule,
        FormsModule,
        ReactiveFormsModule,
        MonacoEditorModule.forRoot()
    ],
    providers: [],
    exports: [TextareaShowcaseComponent, 
              InputFieldShowcaseComponent,
              DocumentationImportInputFieldComponent,
              DocumentationSourceInputFieldComponent,
              DocumentationGettingStartedInputFieldComponent,
              SbbFieldShowcaseComponent,
              DocumentationImportSbbFieldComponent,
              DocumentationSourceSbbFieldComponent,
              DocumentationGettingStartedSbbFieldComponent]
})
export class ExamplesModule { }
