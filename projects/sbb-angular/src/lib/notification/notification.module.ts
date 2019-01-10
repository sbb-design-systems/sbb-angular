import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationIconDirective } from './notification-icon.directive';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';


@NgModule({
  imports: [
    CommonModule,
    IconCommonModule
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
