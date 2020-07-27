import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationModule } from '@sbb-esta/angular-business/notification';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';

import { provideExamples } from '../../../shared/example-provider';

import { ClosableNotificationExampleComponent } from './closable-notification-example/closable-notification-example.component';
import {
  ComponentNotificationSimpleExampleComponent,
  ExampleComponent,
} from './component-notification-simple-example/component-notification-simple-example.component';
import { CustomIconNotificationExampleComponent } from './custom-icon-notification-example/custom-icon-notification-example.component';
import { DurationNotificationSimpleExampleComponent } from './duration-notification-simple-example/duration-notification-simple-example.component';
import { JumpmarkNotificationExampleComponent } from './jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from './simple-notification-example/simple-notification-example.component';
import { SimpleNotificationSimpleExampleComponent } from './simple-notification-simple-example/simple-notification-simple-example.component';
import { TemplateNotificationSimpleExampleComponent } from './template-notification-simple-example/template-notification-simple-example.component';

const EXAMPLES = [
  ClosableNotificationExampleComponent,
  CustomIconNotificationExampleComponent,
  JumpmarkNotificationExampleComponent,
  SimpleNotificationExampleComponent,
  DurationNotificationSimpleExampleComponent,
  SimpleNotificationSimpleExampleComponent,
  TemplateNotificationSimpleExampleComponent,
  ComponentNotificationSimpleExampleComponent,
  ExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-notification-example': SimpleNotificationExampleComponent,
  'custom-icon-notification-example': CustomIconNotificationExampleComponent,
  'jumpmark-notification-example': JumpmarkNotificationExampleComponent,
  'closable-notification-example': ClosableNotificationExampleComponent,
  'toast-duration-notification-example': DurationNotificationSimpleExampleComponent,
  'toast-notification-simple-example': SimpleNotificationSimpleExampleComponent,
  'toast-component-notification-example': ComponentNotificationSimpleExampleComponent,
  'toast-template-notification-example': TemplateNotificationSimpleExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    NotificationModule,
    IconBulbOnModule,
    IconClockModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'notification', EXAMPLE_INDEX)],
})
export class NotificationExamplesModule {}
