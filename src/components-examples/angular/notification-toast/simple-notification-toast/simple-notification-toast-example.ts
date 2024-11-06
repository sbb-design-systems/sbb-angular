import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import {
  SbbNotificationToast,
  SbbNotificationToastVerticalPosition,
  SbbNotificationType,
} from '@sbb-esta/angular/notification-toast';

/**
 * @title Simple Notification Toast
 * @order 10
 */
@Component({
  selector: 'sbb-simple-notification-toast-example',
  templateUrl: 'simple-notification-toast-example.html',
  styleUrls: ['simple-notification-toast-example.css'],
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule, SbbButtonModule],
})
export class SimpleNotificationToastExample {
  type: SbbNotificationType = 'success';
  types = ['success', 'info', 'error', 'warn'];
  positions = ['top', 'bottom'];
  position: SbbNotificationToastVerticalPosition = 'bottom';
  private _notification = inject(SbbNotificationToast);

  showNotification() {
    this._notification
      .open('This is a simple test message', {
        type: this.type,
        verticalPosition: this.position,
      })
      .afterOpened()
      .subscribe(() => console.log('opened'));
  }
}
