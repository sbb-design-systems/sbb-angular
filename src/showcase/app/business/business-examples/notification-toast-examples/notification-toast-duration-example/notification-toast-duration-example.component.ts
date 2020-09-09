import { Component } from '@angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular-business/notification-toast';

@Component({
  selector: 'sbb-notification-toast-duration-example',
  templateUrl: './notification-toast-duration-example.component.html',
})
export class NotificationToastDurationExampleComponent {
  duration = 3000;

  constructor(private _notification: SbbNotificationToast) {}

  showNotification() {
    this._notification.open('test', {
      duration: this.duration,
    });
  }
}
