import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationModule } from '@sbb-esta/angular-business/notification';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';

import { ClosableNotificationExampleComponent } from './closable-notification-example/closable-notification-example.component';
import { CustomIconNotificationExampleComponent } from './custom-icon-notification-example/custom-icon-notification-example.component';
import { JumpmarkNotificationExampleComponent } from './jumpmark-notification-example/jumpmark-notification-example.component';
import { SimpleNotificationExampleComponent } from './simple-notification-example/simple-notification-example.component';

const EXAMPLES = [
  ClosableNotificationExampleComponent,
  CustomIconNotificationExampleComponent,
  JumpmarkNotificationExampleComponent,
  SimpleNotificationExampleComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    NotificationModule,
    IconBulbOnModule,
    IconClockModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class NotificationExamplesModule {}
