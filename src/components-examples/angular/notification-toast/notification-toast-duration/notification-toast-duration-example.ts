import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

/**
 * @title Notification Toast Duration
 * @order 40
 */
@Component({
  selector: 'sbb-notification-toast-duration-example',
  templateUrl: 'notification-toast-duration-example.html',
  styleUrls: ['notification-toast-duration-example.css'],
  standalone: true,
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
})
export class NotificationToastDurationExample {
  duration = 3000;
  private _notification = inject(SbbNotificationToast);

  showNotification() {
    this._notification.open('This is a simple test message', {
      duration: this.duration,
    });
  }
}
