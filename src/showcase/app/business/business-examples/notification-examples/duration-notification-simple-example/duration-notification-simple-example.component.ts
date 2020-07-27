import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-duration-notification-simple-example',
  templateUrl: './duration-notification-simple-example.component.html',
})
export class DurationNotificationSimpleExampleComponent {
  duration = 3000;

  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification.open('test', {
      duration: this.duration,
    });
  }
}
