import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationToastModule } from '@sbb-esta/angular-business/notification-toast';

import { provideExamples } from '../../../shared/example-provider';

import {
  ExampleToastComponent,
  NotificationToastComponentExampleComponent,
} from './notification-toast-component-example/notification-toast-component-example.component';
import { NotificationToastDurationExampleComponent } from './notification-toast-duration-example/notification-toast-duration-example.component';
import { NotificationToastTemplateExampleComponent } from './notification-toast-template-example/notification-toast-template-example.component';
import { SimpleNotificationToastExampleComponent } from './simple-notification-toast-example/simple-notification-toast-example.component';

const EXAMPLES = [
  ExampleToastComponent,
  NotificationToastComponentExampleComponent,
  NotificationToastDurationExampleComponent,
  NotificationToastTemplateExampleComponent,
  SimpleNotificationToastExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-notification-toast-example': SimpleNotificationToastExampleComponent,
  'notification-toast-duration-example': NotificationToastDurationExampleComponent,
  'notification-toast-component-example': NotificationToastComponentExampleComponent,
  'notification-toast-template-example': NotificationToastTemplateExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    FieldModule,
    NotificationToastModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'notification-toast', EXAMPLE_INDEX)],
})
export class NotificationToastExamplesModule {}
