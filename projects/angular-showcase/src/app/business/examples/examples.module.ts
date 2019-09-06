import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ContextmenuModule } from '@sbb-esta/angular-business';
import { IconCollectionModule } from '@sbb-esta/angular-icons';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { ContextmenuShowcaseComponent } from './contextmenu-showcase/contextmenu-showcase.component';
const exampleComponents = [ContextmenuShowcaseComponent];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ContextmenuModule,
    IconCollectionModule,
    MonacoEditorModule.forRoot(),
    OverlayModule
  ]
})
export class ExamplesModule {}
