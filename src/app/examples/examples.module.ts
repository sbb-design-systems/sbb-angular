import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TextareaModule, LinksModule } from 'sbb-angular';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    LinksModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent
  ]
})
export class ExamplesModule { }
