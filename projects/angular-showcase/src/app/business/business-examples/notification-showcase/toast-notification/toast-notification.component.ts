import { Component } from '@angular/core';
import {
  NotificationToastPosition,
  NotificationType
} from '@sbb-esta/angular-business/notification';

import { NOTIFICATION_TYPES, TOAST_POSITIONS } from '../notification-data';

@Component({
  selector: 'sbb-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent {
  toastType = NotificationType.SUCCESS;
  toastPosition = NotificationToastPosition.BOTTOMRIGHT;
  toastActive = false;
  types = NOTIFICATION_TYPES.slice();
  toastPositions = TOAST_POSITIONS.slice();

  toggleToast() {
    this.toastActive = !this.toastActive;
  }
}
