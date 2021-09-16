import { Component, NgModule } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

@Component({
  selector: 'test',
  template: `
    <sbb-notification type="success">Success</sbb-notification>

    <sbb-notification type="error" indicatorIcon="kom:clock-small">New timezone saved successfully
      
    </sbb-notification>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbNotificationModule],
})
export class NotificationTestModule {}
