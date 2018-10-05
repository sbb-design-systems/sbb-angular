import { NgModule } from '@angular/core';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { InputFieldShowcaseComponent } from './input-field-showcase/input-field-showcase.component';
import { TextareaModule, TextInputModule } from 'sbb-angular';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [TextareaShowcaseComponent, InputFieldShowcaseComponent],
    imports: [
        TextareaModule,
        TextInputModule,
        FormsModule
    ],
    providers: [],
    exports: [TextareaShowcaseComponent, InputFieldShowcaseComponent]
})
export class ExamplesModule { }
