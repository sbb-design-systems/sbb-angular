import { NgModule } from '@angular/core';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { TextareaModule } from 'sbb-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
    declarations: [TextareaShowcaseComponent],
    imports: [
        CommonModule,
        TextareaModule,
        FormsModule
    ],
    providers: [],
    exports: [TextareaShowcaseComponent]
})
export class ExamplesModule { }
