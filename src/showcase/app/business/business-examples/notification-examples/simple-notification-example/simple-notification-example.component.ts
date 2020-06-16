import { Component } from '@angular/core';
import { Notification, NotificationType } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-simple-notification-example',
  templateUrl: './simple-notification-example.component.html',
})
export class SimpleNotificationExampleComponent {
  type = NotificationType.SUCCESS;
  types = ['success', 'info', 'error', 'warn'];
  positions = ['top', 'bottom'];
  position: 'top' | 'bottom' = 'bottom';

  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification.open('test', {
      type: this.type,
      verticalPosition: this.position,
    });
  }
}
