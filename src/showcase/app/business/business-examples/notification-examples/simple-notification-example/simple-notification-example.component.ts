import { Component } from '@angular/core';
import { NotificationType } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-simple-notification-example',
  templateUrl: './simple-notification-example.component.html',
  styleUrls: ['./simple-notification-example.component.css'],
})
export class SimpleNotificationExampleComponent {
  type = NotificationType.SUCCESS;
  types = ['success', 'info', 'error', 'warn'];
}
