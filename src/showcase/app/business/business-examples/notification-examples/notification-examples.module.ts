import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationModule } from '@sbb-esta/angular-business/notification';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';

import { provideExamples } from '../../../shared/example-provider';

import { ClosableNotificationExampleComponent } from './closable-notification-example/closable-notification-example.component';
import { CustomIconNotificationExampleComponent } from './custom-icon-notification-example/custom-icon-notification-example.component';
import { JumpmarkNotificationExampleComponent } from './jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from './simple-notification-example/simple-notification-example.component';

const EXAMPLES = [
  ClosableNotificationExampleComponent,
  CustomIconNotificationExampleComponent,
  JumpmarkNotificationExampleComponent,
  SimpleNotificationExampleComponent,
];

const EXAMPLE_INDEX = {
  'closable-notification-example': ClosableNotificationExampleComponent,
  'custom-icon-notification-example': CustomIconNotificationExampleComponent,
  'jumpmark-notification-example': JumpmarkNotificationExampleComponent,
  'simple-notification-example': SimpleNotificationExampleComponent,
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
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'notification', EXAMPLE_INDEX)],
})
export class NotificationExamplesModule {}
