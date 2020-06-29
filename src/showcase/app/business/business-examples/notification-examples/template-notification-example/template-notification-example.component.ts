import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-template-notification-example',
  templateUrl: './template-notification-example.component.html',
})
export class TemplateNotificationExampleComponent {
  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification.openFromTemplate('<strong>Template content</strong>');
  }
}
