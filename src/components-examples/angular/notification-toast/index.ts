import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationToastModule } from '@sbb-esta/angular/notification-toast';

import {
  ExampleToastComponent,
  NotificationToastComponentExample,
} from './notification-toast-component/notification-toast-component-example';
import { NotificationToastDurationExample } from './notification-toast-duration/notification-toast-duration-example';
import { NotificationToastTemplateExample } from './notification-toast-template/notification-toast-template-example';
import { SimpleNotificationToastExample } from './simple-notification-toast/simple-notification-toast-example';

export {
  ExampleToastComponent,
  NotificationToastComponentExample,
  NotificationToastDurationExample,
  NotificationToastTemplateExample,
  SimpleNotificationToastExample,
};

const EXAMPLES = [
  ExampleToastComponent,
  NotificationToastComponentExample,
  NotificationToastDurationExample,
  NotificationToastTemplateExample,
  SimpleNotificationToastExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbInputModule,
    SbbNotificationToastModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class NotificationToastExamplesModule {}
