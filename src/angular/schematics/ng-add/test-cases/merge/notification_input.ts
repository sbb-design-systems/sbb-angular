import { Component, NgModule } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular-public';

@Component({
  selector: 'test',
  template: `
    <sbb-notification message="Success" type="success"></sbb-notification>

    <sbb-notification message="New timezone saved successfully" type="error">
      <sbb-icon svgIcon="kom:clock-small" *sbbIcon></sbb-icon>
    </sbb-notification>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbNotificationModule],
})
export class NotificationTestModule {}
