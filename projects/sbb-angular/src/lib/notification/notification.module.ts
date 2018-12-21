import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationIconDirective } from './notification-icon.directive';

@NgModule({
  imports: [
    CommonModule
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
