import { Component } from '@angular/core';
import { JumpMark, NotificationType } from 'sbb-angular';

@Component({
  selector: 'sbb-notification-showcase',
  templateUrl: './notification-showcase.component.html',
  styleUrls: ['./notification-showcase.component.scss']
})
export class NotificationShowcaseComponent {
  jumpMarks: JumpMark[] = [
    { elementId: '#default', title: 'Hello' },
    { elementId: '#default', title: 'Suchen' }
  ];

  type = NotificationType.SUCCESS;

  types = [
    NotificationType.SUCCESS,
    NotificationType.INFO,
    NotificationType.ERROR
  ];
}
