import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationIconDirective } from './notification-icon.directive';
import { IconTickModule, IconSignExclamationPointModule, IconCircleInformationModule } from 'sbb-angular-icons';


@NgModule({
  imports: [
    CommonModule,
    IconTickModule,
    IconSignExclamationPointModule,
    IconCircleInformationModule,
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
