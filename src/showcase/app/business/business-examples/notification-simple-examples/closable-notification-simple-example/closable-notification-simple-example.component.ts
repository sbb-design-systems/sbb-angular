import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification-simple';

@Component({
  selector: 'sbb-custom-icon-notification-simple-example',
  templateUrl: './closable-notification-simple-example.component.html',
})
export class ClosableNotificationSimpleExampleComponent {
  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification
      .open('test', { readonly: false })
      .afterDismissed()
      .subscribe(() => console.log('closed'));
  }
}
