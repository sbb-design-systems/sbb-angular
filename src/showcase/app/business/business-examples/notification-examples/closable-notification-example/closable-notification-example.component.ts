import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-custom-icon-notification-example',
  templateUrl: './closable-notification-example.component.html',
})
export class ClosableNotificationExampleComponent {
  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification.open('test', {
      readonly: false,
    });
  }
}
