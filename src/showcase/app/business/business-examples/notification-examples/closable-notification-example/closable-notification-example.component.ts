import { Component } from '@angular/core';

@Component({
  selector: 'sbb-custom-icon-notification-example',
  templateUrl: './closable-notification-example.component.html',
})
export class ClosableNotificationExampleComponent {
  dismissed() {
    console.log('Notification dismissed');
  }
}
