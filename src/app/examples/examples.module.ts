import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
import { TextFieldShowcaseComponent } from './text-field-showcase/text-field-showcase.component';
import { TextareaModule, TextInputModule } from 'sbb-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
    declarations: [TextareaShowcaseComponent, InputFieldShowcaseComponent, TextFieldShowcaseComponent],
    imports: [
        BrowserModule,
        CommonModule,
        TextareaModule,
        TextInputModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    exports: [TextareaShowcaseComponent, InputFieldShowcaseComponent, TextFieldShowcaseComponent]
})
export class ExamplesModule { }
