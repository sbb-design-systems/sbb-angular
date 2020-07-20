import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationSimpleModule } from '@sbb-esta/angular-business/notification-simple';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';

import { provideExamples } from '../../../shared/example-provider';

import {
  ComponentNotificationSimpleExampleComponent,
  ExampleComponent,
} from './component-notification-simple-example/component-notification-simple-example.component';
import { DurationNotificationSimpleExampleComponent } from './duration-notification-simple-example/duration-notification-simple-example.component';
import { SimpleNotificationSimpleExampleComponent } from './simple-notification-simple-example/simple-notification-simple-example.component';
import { TemplateNotificationSimpleExampleComponent } from './template-notification-simple-example/template-notification-simple-example.component';

const EXAMPLES = [
  DurationNotificationSimpleExampleComponent,
  SimpleNotificationSimpleExampleComponent,
  TemplateNotificationSimpleExampleComponent,
  ComponentNotificationSimpleExampleComponent,
  ExampleComponent,
];

const EXAMPLE_INDEX = {
  'duration-notification-example': DurationNotificationSimpleExampleComponent,
  'simple-notification-example': SimpleNotificationSimpleExampleComponent,
  'component-notification-example': ComponentNotificationSimpleExampleComponent,
  'template-notification-example': TemplateNotificationSimpleExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    NotificationSimpleModule,
    IconBulbOnModule,
    IconClockModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'notification-simple', EXAMPLE_INDEX)],
})
export class NotificationSimpleExamplesModule {}
