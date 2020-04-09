import { Component } from '@angular/core';
import { JumpMark, NotificationType } from '@sbb-esta/angular-public/notification';

@Component({
  selector: 'sbb-notification-example',
  templateUrl: './notification-example.component.html',
  styleUrls: ['./notification-example.component.css']
})
export class NotificationExampleComponent {
  jumpMarks: JumpMark[] = [
    { elementId: '#default', title: 'Hello' },
    { elementId: '#default', title: 'Suchen' }
  ];

  type = NotificationType.SUCCESS;

  types = [NotificationType.SUCCESS, NotificationType.INFO, NotificationType.ERROR];
}
