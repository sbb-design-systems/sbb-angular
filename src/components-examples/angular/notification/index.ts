import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

import { ClosableNotificationExample } from './closable-notification/closable-notification-example';
import { CustomIconNotificationExample } from './custom-icon-notification/custom-icon-notification-example';
import { JumpmarkNotificationExample } from './jumpmark-notification/jumpmark-notification-example';
import { SimpleNotificationExample } from './simple-notification/simple-notification-example';

export {
  ClosableNotificationExample,
  CustomIconNotificationExample,
  JumpmarkNotificationExample,
  SimpleNotificationExample,
};

const EXAMPLES = [
  ClosableNotificationExample,
  CustomIconNotificationExample,
  JumpmarkNotificationExample,
  SimpleNotificationExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbIconModule,
    SbbInputModule,
    SbbNotificationModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class NotificationExamplesModule {}
