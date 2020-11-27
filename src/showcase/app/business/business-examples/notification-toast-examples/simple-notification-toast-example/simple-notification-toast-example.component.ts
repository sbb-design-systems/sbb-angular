import { Component } from '@angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular-business/notification-toast';

@Component({
  selector: 'sbb-simple-notification-toast-example',
  templateUrl: './simple-notification-toast-example.component.html',
  styleUrls: ['./simple-notification-toast-example.component.css'],
})
export class SimpleNotificationToastExampleComponent {
  type: 'success' | 'info' | 'error' | 'warn' = 'success';
  types = ['success', 'info', 'error', 'warn'];
  positions = ['top', 'bottom'];
  position: 'top' | 'bottom' = 'bottom';

  constructor(private _notification: SbbNotificationToast) {}

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
