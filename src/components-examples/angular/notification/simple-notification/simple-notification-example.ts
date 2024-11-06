import { Component } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

/**
 * @title Simple Notification
 * @order 10
 */
@Component({
  selector: 'sbb-simple-notification-example',
  templateUrl: 'simple-notification-example.html',
  styleUrls: ['simple-notification-example.css'],
  imports: [SbbNotificationModule],
})
export class SimpleNotificationExample {}
