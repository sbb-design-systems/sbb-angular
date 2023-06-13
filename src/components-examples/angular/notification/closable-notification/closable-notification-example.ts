import { Component } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

/**
 * @title Closable/Readonly Notification in Lean design
 * @order 40
 */
@Component({
  selector: 'sbb-closable-notification-example',
  templateUrl: 'closable-notification-example.html',
  standalone: true,
  imports: [SbbNotificationModule],
})
export class ClosableNotificationExample {
  handleDismissed() {
    console.log('Notification dismissed');
  }
}
