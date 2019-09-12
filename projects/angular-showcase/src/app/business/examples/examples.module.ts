import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { HeaderModule } from '@sbb-esta/angular-business/header';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { ContextmenuShowcaseComponent } from './contextmenu-showcase/contextmenu-showcase.component';
import { ProcessflowShowcaseComponent } from './processflow-showcase/processflow-showcase.component';

const exampleComponents = [ContextmenuShowcaseComponent, ProcessflowShowcaseComponent];

@NgModule({
  declarations: exampleComponents,
  entryComponents: exampleComponents,
  exports: exampleComponents,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IconCollectionModule,
    ButtonModule,
    CheckboxModule,
    ContextmenuModule,
    HeaderModule,
    ProcessflowModule
  ]
})
export class ExamplesModule {}
