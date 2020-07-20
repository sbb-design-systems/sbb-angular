import { Component } from '@angular/core';
import { Notification, NotificationType } from '@sbb-esta/angular-business/notification-simple';

@Component({
  selector: 'sbb-simple-notification-example',
  templateUrl: './simple-notification-simple-example.component.html',
})
export class SimpleNotificationSimpleExampleComponent {
  type = NotificationType.SUCCESS;
  types = ['success', 'info', 'error', 'warn'];
  positions = ['top', 'bottom'];
  position: 'top' | 'bottom' = 'bottom';

  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification
      .open('test', {
        type: this.type,
        verticalPosition: this.position,
      })
      .afterOpened()
      .subscribe(() => console.log('opened'));
  }
}
