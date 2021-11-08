import { Component } from '@angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

/**
 * @title Notification Toast Duration
 * @order 40
 */
@Component({
  selector: 'sbb-notification-toast-duration-example',
  templateUrl: 'notification-toast-duration-example.html',
  styleUrls: ['notification-toast-duration-example.css'],
})
export class NotificationToastDurationExample {
  duration = 3000;

  constructor(private _notification: SbbNotificationToast) {}

  showNotification() {
    this._notification.open('test', {
      duration: this.duration,
    });
  }
}
