import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationModule } from '@sbb-esta/angular-business/notification';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';

import { provideExamples } from '../../../shared/example-provider';

import { ClosableNotificationExampleComponent } from './closable-notification-example/closable-notification-example.component';
import {
  ComponentNotificationExampleComponent,
  ExampleComponent,
} from './component-notification-example/component-notification-example.component';
import { CustomIconNotificationExampleComponent } from './custom-icon-notification-example/custom-icon-notification-example.component';
import { JumpmarkNotificationExampleComponent } from './jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from './simple-notification-example/simple-notification-example.component';
import { TemplateNotificationExampleComponent } from './template-notification-example/template-notification-example.component';

const EXAMPLES = [
  ClosableNotificationExampleComponent,
  CustomIconNotificationExampleComponent,
  JumpmarkNotificationExampleComponent,
  SimpleNotificationExampleComponent,
  TemplateNotificationExampleComponent,
  ComponentNotificationExampleComponent,
  ExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-notification-example': SimpleNotificationExampleComponent,
  'component-notification-example': ComponentNotificationExampleComponent,
  'custom-icon-notification-example': CustomIconNotificationExampleComponent,
  'jumpmark-notification-example': JumpmarkNotificationExampleComponent,
  'closable-notification-example': ClosableNotificationExampleComponent,
  'template-notification-example': TemplateNotificationExampleComponent,
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
