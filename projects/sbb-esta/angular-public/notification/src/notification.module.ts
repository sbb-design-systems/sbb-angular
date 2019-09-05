import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconCircleInformationModule,
  IconSignExclamationPointModule,
  IconTickModule
} from '@sbb-esta/angular-icons';

import { NotificationIconDirective } from './notification-icon.directive';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    IconTickModule,
    IconSignExclamationPointModule,
    IconCircleInformationModule,
    IconDirectiveModule
  ],
  declarations: [NotificationComponent, NotificationIconDirective],
  exports: [NotificationComponent, NotificationIconDirective, IconDirectiveModule]
})
export class NotificationsModule {}
