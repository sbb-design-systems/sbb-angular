import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { ContextmenuModule } from '@sbb-esta/angular-business/contextmenu';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { HeaderModule } from '@sbb-esta/angular-business/header';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';
import { TabsModule } from '@sbb-esta/angular-business/tabs';
import { TooltipModule } from '@sbb-esta/angular-business/tooltip';
import { UserMenuModule } from '@sbb-esta/angular-business/usermenu';
import { IconCollectionModule } from '@sbb-esta/angular-icons';

import { SimpleContextmenuComponent } from './simple-contextmenu/simple-contextmenu.component';
import { SkippableProcessflowComponent } from './skippable-processflow/skippable-processflow.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { UsermenuShowcaseComponent } from './usermenu-showcase/usermenu-showcase.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';

const exampleComponents = [
  SimpleContextmenuComponent,
  SkippableProcessflowComponent,
  TooltipShowcaseComponent,
  PersonListComponent,
  TabsShowcaseComponent,
  UsermenuShowcaseComponent
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
    TabsModule,
    UserMenuModule
  ]
})
export class BusinessExamplesModule {}
