import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TextareaModule, LinksModule, RadioButtonModule, CheckboxModule } from 'sbb-angular';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { RadioButtonShowcaseComponent } from './radio-button-showcase/radio-button-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    LinksModule,
    RadioButtonModule,
    CheckboxModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    RadioButtonShowcaseComponent,
    CheckboxShowcaseComponent
  ]
})
export class ExamplesModule { }
