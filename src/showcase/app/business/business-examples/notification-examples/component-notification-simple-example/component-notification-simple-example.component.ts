import { Component } from '@angular/core';
import { Notification } from '@sbb-esta/angular-business/notification';

@Component({
  selector: 'sbb-component-notification-simple-example',
  templateUrl: './component-notification-simple-example.component.html',
})
export class ComponentNotificationSimpleExampleComponent {
  constructor(private _notification: Notification) {}

  showNotification() {
    this._notification.openFromComponent(ExampleComponent);
  }
}

@Component({
  selector: 'sbb-component-example',
  template: `<span class="example-style">
    SBB CFF FFS
  </span>`,
  styles: [
    `
      .example-style {
        color: darkred;
      }
    `,
  ],
})
export class ExampleComponent {}
