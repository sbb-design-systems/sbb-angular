import { Component, inject } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

/**
 * @title Notification Toast Component
 * @order 20
 */
@Component({
  selector: 'sbb-notification-toast-component-example',
  templateUrl: 'notification-toast-component-example.html',
  standalone: true,
  imports: [SbbButtonModule],
})
export class NotificationToastComponentExample {
  private _notification = inject(SbbNotificationToast);

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
        font-style: italic;
      }
    `,
  ],
  standalone: true,
})
export class ExampleToastComponent {}
