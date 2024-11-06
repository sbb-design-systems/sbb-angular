import { Component } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

/**
 * @title Custom Icon Notification
 * @order 20
 */
@Component({
  selector: 'sbb-custom-icon-notification-example',
  templateUrl: 'custom-icon-notification-example.html',
  imports: [SbbNotificationModule],
})
export class CustomIconNotificationExample {}
