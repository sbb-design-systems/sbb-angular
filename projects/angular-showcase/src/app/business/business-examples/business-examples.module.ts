import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { DialogModule } from '@sbb-esta/angular-business/dialog';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { HeaderModule } from '@sbb-esta/angular-business/header';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';
import { RadioButtonModule } from '@sbb-esta/angular-business/radio-button';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { UserMenuModule } from '@sbb-esta/angular-business/usermenu';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import {
  DialogShowcaseComponent,
  DialogShowcaseExample2Component,
  DialogShowcaseExample2ContentComponent,
  DialogShowcaseExample3Component,
  DialogShowcaseExampleComponent,
  DialogShowcaseExampleContentComponent
} from './dialog-showcase/dialog-showcase.component';
import { SimpleContextmenuComponent } from './simple-contextmenu/simple-contextmenu.component';
import { SkippableProcessflowComponent } from './skippable-processflow/skippable-processflow.component';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { UsermenuShowcaseComponent } from './usermenu-showcase/usermenu-showcase.component';

const exampleComponents = [
  SimpleContextmenuComponent,
  SkippableProcessflowComponent,
  TooltipShowcaseComponent,
  UsermenuShowcaseComponent,
  DialogShowcaseComponent,
  DialogShowcaseExampleComponent,
  DialogShowcaseExampleContentComponent,
  DialogShowcaseExample2Component,
  DialogShowcaseExample2ContentComponent,
  DialogShowcaseExample3Component
];

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
    FieldModule,
    HeaderModule,
    ProcessflowModule,
    TooltipModule,
    UserMenuModule,
    DialogModule,
    RadioButtonModule
  ]
})
export class BusinessExamplesModule {}
