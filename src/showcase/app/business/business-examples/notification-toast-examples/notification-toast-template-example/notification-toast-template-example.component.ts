import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular-business/notification-toast';

@Component({
  selector: 'sbb-notification-toast-template-example',
  templateUrl: './notification-toast-template-example.component.html',
})
export class NotificationToastTemplateExampleComponent {
  @ViewChild('content') content: TemplateRef<any>;

  constructor(private _notification: SbbNotificationToast) {}

  showNotification() {
    this._notification.openFromTemplate(this.content);
  }
}
