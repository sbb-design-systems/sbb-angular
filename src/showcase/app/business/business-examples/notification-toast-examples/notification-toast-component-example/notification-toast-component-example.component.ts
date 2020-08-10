import { Component } from '@angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular-business/notification-toast';

@Component({
  selector: 'sbb-notification-toast-component-example',
  templateUrl: './notification-toast-component-example.component.html',
})
export class NotificationToastComponentExampleComponent {
  constructor(private _notification: SbbNotificationToast) {}

  showNotification() {
    this._notification.openFromComponent(ExampleToastComponent);
  }
}

@Component({
  selector: 'sbb-example-toast',
  template: `<span class="example-style">SBB CFF FFS</span>`,
  styles: [
    `
      .example-style {
        color: darkred;
      }
    `,
  ],
})
export class ExampleToastComponent {}
