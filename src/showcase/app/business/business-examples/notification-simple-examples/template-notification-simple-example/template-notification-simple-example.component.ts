import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification-simple';

@Component({
  selector: 'sbb-template-notification-example',
  templateUrl: './template-notification-simple-example.component.html',
})
export class TemplateNotificationSimpleExampleComponent {
  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification.openFromTemplate('<strong>Template content</strong>');
  }
}
