import { Component, NgModule } from '@angular/core';
import { SbbNotificationModule } from '@sbb-esta/angular/notification';

@Component({
  selector: 'test',
  template: `
    <sbb-notification i18n type="success">Success</sbb-notification>

    <sbb-notification i18n="@@exampleId" type="error" indicatorIcon="kom:clock-small">New timezone saved successfully
      
    </sbb-notification>
  `,
})
export class TestComponent {}

@NgModule({
  declarations: [TestComponent],
  imports: [SbbNotificationModule],
})
export class NotificationTestModule {}
