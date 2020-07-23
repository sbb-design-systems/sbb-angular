import { Component } from '@angular/core';

@Component({
  selector: 'sbb-simple-notification-example',
  templateUrl: './simple-notification-example.component.html',
  styleUrls: ['./simple-notification-example.component.css'],
})
export class SimpleNotificationExampleComponent {
  type: 'success' | 'info' | 'error' = 'success';
  types = ['success', 'info', 'error'];
}
