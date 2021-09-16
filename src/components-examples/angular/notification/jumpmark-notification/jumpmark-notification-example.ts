import { Component } from '@angular/core';

/**
 * @title Jumpmark Notification
 * @order 30
 */
@Component({
  selector: 'sbb-jumpmark-notification-example',
  templateUrl: './jumpmark-notification-example.html',
})
export class JumpmarkNotificationExample {
  jumpmarks = [
    { elementId: '#tip1', title: 'Tip 1' },
    { elementId: '#tip2', title: 'Tip 2' },
  ];
}
