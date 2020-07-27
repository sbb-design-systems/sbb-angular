import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-simple-notification-simple-example',
  templateUrl: './simple-notification-simple-example.component.html',
})
export class SimpleNotificationSimpleExampleComponent {
  type: 'success' | 'info' | 'error' | 'warn' = 'success';
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
