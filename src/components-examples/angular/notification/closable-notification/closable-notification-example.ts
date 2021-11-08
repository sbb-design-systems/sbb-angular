import { Component } from '@angular/core';

/**
 * @title Closable/Readonly Notification in Lean design
 * @order 40
 */
@Component({
  selector: 'sbb-closable-notification-example',
  templateUrl: 'closable-notification-example.html',
})
export class ClosableNotificationExample {
  handleDismissed() {
    console.log('Notification dismissed');
  }
}
