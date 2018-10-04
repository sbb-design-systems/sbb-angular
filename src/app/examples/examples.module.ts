import { NgModule } from '@angular/core';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { TextareaModule } from 'sbb-angular';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [TextareaShowcaseComponent],
    imports: [
        TextareaModule,
        FormsModule
    ],
    providers: [],
    exports: [TextareaShowcaseComponent]
})
export class ExamplesModule { }
