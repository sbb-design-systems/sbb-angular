import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TextareaModule, LinksModule, CheckboxModule } from 'sbb-angular';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { CheckboxShowcaseComponent } from './checkbox-showcase/checkbox-showcase.component';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    CheckboxShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    LinksModule,
    CheckboxModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    CheckboxShowcaseComponent
  ]
})
export class ExamplesModule { }
