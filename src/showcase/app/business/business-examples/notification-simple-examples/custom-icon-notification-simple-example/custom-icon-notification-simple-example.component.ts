import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification-simple';

@Component({
  selector: 'sbb-custom-icon-notification-simple-example',
  templateUrl: './custom-icon-notification-simple-example.component.html',
})
export class CustomIconNotificationSimpleExampleComponent {
  constructor(private _notification: Notification) {}

  @ViewChild('anotherIcon', { read: TemplateRef, static: true })
  anotherIcon: TemplateRef<any>;

  showNotification() {
    this._notification.open('test', {
      icon: this.anotherIcon,
    });
  }
}
