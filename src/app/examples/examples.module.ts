import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextareaModule, LinksModule, ButtonModule } from 'sbb-angular';

import { TextareaShowcaseComponent } from './textarea-showcase/textarea-showcase.component';
import { LinksShowcaseComponent } from './links-showcase/links-showcase.component';
import { CommonModule } from '@angular/common';
import { ButtonShowcaseComponent } from './button-showcase/button-showcase.component';

@NgModule({
  declarations: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    ButtonShowcaseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    LinksModule,
    ButtonModule
  ],
  providers: [],
  exports: [
    TextareaShowcaseComponent,
    LinksShowcaseComponent,
    ButtonShowcaseComponent
  ]
})
export class ExamplesModule { }
