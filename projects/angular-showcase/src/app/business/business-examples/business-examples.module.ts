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
import { NotificationsModule } from '@sbb-esta/angular-business/notification';
import { PaginationModule } from '@sbb-esta/angular-business/pagination';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';
import { RadioButtonModule } from '@sbb-esta/angular-business/radio-button';
import { TabsModule } from '@sbb-esta/angular-business/tabs';
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
import { ClosableNotificationComponent } from './notification-showcase/closable-notification/closable-notification.component';
import { CustomIconNotificationComponent } from './notification-showcase/custom-icon-notification/custom-icon-notification.component';
import { JumpmarkNotificationComponent } from './notification-showcase/jumpmark-notification/jumpmark-notification.component';
import { SimpleNotificationComponent } from './notification-showcase/simple-notification/simple-notification.component';
import { ToastNotificationComponent } from './notification-showcase/toast-notification/toast-notification.component';
import { PaginationShowcaseComponent } from './pagination-showcase/pagination-showcase.component';
import { SimpleContextmenuComponent } from './simple-contextmenu/simple-contextmenu.component';
import { SkippableProcessflowComponent } from './skippable-processflow/skippable-processflow.component';
import { PersonListComponent } from './tabs-showcase/person/person-list/person-list.component';
import { TabsShowcaseComponent } from './tabs-showcase/tabs-showcase.component';
import { TooltipShowcaseComponent } from './tooltip-showcase/tooltip-showcase.component';
import { UsermenuShowcaseComponent } from './usermenu-showcase/usermenu-showcase.component';

const exampleComponents = [
  SimpleContextmenuComponent,
  SkippableProcessflowComponent,
  TooltipShowcaseComponent,
  PersonListComponent,
  TabsShowcaseComponent,
  UsermenuShowcaseComponent,
  DialogShowcaseComponent,
  DialogShowcaseExampleComponent,
  DialogShowcaseExampleContentComponent,
  DialogShowcaseExample2Component,
  DialogShowcaseExample2ContentComponent,
  DialogShowcaseExample3Component,
  PaginationShowcaseComponent,
  CustomIconNotificationComponent,
  SimpleNotificationComponent,
  JumpmarkNotificationComponent,
  ToastNotificationComponent,
  ClosableNotificationComponent
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
    UserMenuModule,
    DialogModule,
    RadioButtonModule,
    PaginationModule,
    NotificationsModule
  ]
})
export class BusinessExamplesModule {}
