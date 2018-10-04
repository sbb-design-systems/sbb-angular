import { NgModule } from '@angular/core';
import { SbbAngularModule } from 'projects/sbb-angular/src/public_api';
import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';


@NgModule({
    declarations: [TextareaShowcaseComponent],
    imports: [
        SbbAngularModule
    ],
    providers: [],
    exports: [TextareaShowcaseComponent]
})
export class ExamplesModule { }
