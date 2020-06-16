import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-custom-icon-notification-example',
  templateUrl: './custom-icon-notification-example.component.html',
})
export class CustomIconNotificationExampleComponent {
  constructor(private _notification: Notification) {}

  @ViewChild('anotherIcon', { read: TemplateRef, static: true })
  anotherIcon: TemplateRef<any>;

  showNotification() {
    this._notification.open('test', {
      icon: this.anotherIcon,
    });
  }
}
