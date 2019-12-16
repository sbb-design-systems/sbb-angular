import { Component } from '@angular/core';
import { NotificationType } from '@sbb-esta/angular-business/notification';

import { NOTIFICATION_TYPES } from '../notification-data';

@Component({
  selector: 'sbb-simple-notification',
  templateUrl: './simple-notification.component.html',
  styleUrls: ['./simple-notification.component.scss']
})
export class SimpleNotificationComponent {
  type = NotificationType.SUCCESS;
  types = NOTIFICATION_TYPES.slice();
}
