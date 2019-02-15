import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationIconDirective } from './notification-icon.directive';
import { IconCheckModule, IconExclamationMarkModule, IconInfoModule } from '../svg-icons/svg-icons';


@NgModule({
  imports: [
    CommonModule,
    IconCheckModule,
    IconExclamationMarkModule,
    IconInfoModule,
  ],
  declarations: [
    NotificationComponent,
    NotificationIconDirective
  ],
  exports: [
    NotificationComponent,
    NotificationIconDirective
  ]
})
export class NotificationsModule { }
