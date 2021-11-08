import { Component, TemplateRef, ViewChild } from '@angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

/**
 * @title Notification Toast Template
 * @order 30
 */
@Component({
  selector: 'sbb-notification-toast-template-example',
  templateUrl: 'notification-toast-template-example.html',
})
export class NotificationToastTemplateExample {
  @ViewChild('content') content: TemplateRef<any>;

  constructor(private _notification: SbbNotificationToast) {}

  showNotification() {
    this._notification.openFromTemplate(this.content);
  }
}
