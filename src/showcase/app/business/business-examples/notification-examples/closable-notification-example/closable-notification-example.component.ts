import { Component } from '@angular/core';

@Component({
  selector: 'sbb-custom-icon-notification-example',
  templateUrl: './closable-notification-example.component.html',
  styleUrls: ['./closable-notification-example.component.css']
})
export class ClosableNotificationExampleComponent {
  dismissed() {
    console.log('Notification dismissed');
  }
}
