import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

/**
 * @title Notification Toast Template
 * @order 30
 */
@Component({
  selector: 'sbb-notification-toast-template-example',
  templateUrl: 'notification-toast-template-example.html',
  standalone: true,
  imports: [SbbButtonModule],
})
export class NotificationToastTemplateExample {
  @ViewChild('content') content: TemplateRef<any>;
  private _notification = inject(SbbNotificationToast);

  showNotification() {
    this._notification.openFromTemplate(this.content);
  }
}
