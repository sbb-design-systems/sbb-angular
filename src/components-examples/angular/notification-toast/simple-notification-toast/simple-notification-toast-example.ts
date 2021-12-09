import { Component } from '@angular/core';
import {
  SbbNotificationToast,
  SbbNotificationToastVerticalPosition,
  SbbNotificationType,
} from '@sbb-esta/angular/notification-toast';

/**
 * @title Simple Notification Toast
 * @order 10
 */
@Component({
  selector: 'sbb-simple-notification-toast-example',
  templateUrl: 'simple-notification-toast-example.html',
  styleUrls: ['simple-notification-toast-example.css'],
})
export class SimpleNotificationToastExample {
  type: SbbNotificationType = 'success';
  types = ['success', 'info', 'error', 'warn'];
  positions = ['top', 'bottom'];
  position: SbbNotificationToastVerticalPosition = 'bottom';

  constructor(private _notification: SbbNotificationToast) {}

  showNotification() {
    this._notification
      .open('This is a simple test message', {
        type: this.type,
        verticalPosition: this.position,
      })
      .afterOpened()
      .subscribe(() => console.log('opened'));
  }
}
