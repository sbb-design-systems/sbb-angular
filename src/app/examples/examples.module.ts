import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule, LinksModule } from 'sbb-angular';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { CommonModule } from '@angular/common';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { RadioButtonModule } from 'projects/sbb-angular/src/public_api';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    RadioButtonShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    LinksModule,
    RadioButtonModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    RadioButtonShowcaseComponent
  ]
})
export class ExamplesModule { }
