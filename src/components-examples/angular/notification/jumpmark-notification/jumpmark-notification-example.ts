import { Component } from '@angular/core';
import { SbbJumpMark } from '@sbb-esta/angular/notification';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

/**
 * @title Jumpmark Notification
 * @order 30
 */
@Component({
  selector: 'sbb-jumpmark-notification-example',
  templateUrl: 'jumpmark-notification-example.html',
  imports: [SbbNotificationModule],
})
export class JumpmarkNotificationExample {
  jumpmarks: SbbJumpMark[] = [
    { elementId: '#tip1', title: 'Tip 1' },
    { elementId: '#tip2', title: 'Tip 2' },
  ];
}
