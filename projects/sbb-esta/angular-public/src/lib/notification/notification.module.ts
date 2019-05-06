import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
    IconCircleInformationModule
  ],
  declarations: [NotificationComponent, NotificationIconDirective],
  exports: [NotificationComponent, NotificationIconDirective]
})
export class NotificationsModule {}
