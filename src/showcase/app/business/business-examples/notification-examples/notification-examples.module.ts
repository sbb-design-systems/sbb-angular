import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from '@sbb-esta/angular-business/field';
import { NotificationModule } from '@sbb-esta/angular-business/notification';
import { IconBulbOnModule } from '@sbb-esta/angular-icons/community';
import { IconClockModule } from '@sbb-esta/angular-icons/timetable';

import { ClosableNotificationComponent } from './closable-notification/closable-notification.component';
import { CustomIconNotificationComponent } from './custom-icon-notification/custom-icon-notification.component';
import { JumpmarkNotificationComponent } from './jumpmark-notification/jumpmark-notification.component';
import { SimpleNotificationComponent } from './simple-notification/simple-notification.component';

const EXAMPLES = [
  ClosableNotificationComponent,
  CustomIconNotificationComponent,
  JumpmarkNotificationComponent,
  SimpleNotificationComponent
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
