import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNotification } from './notification';
import { SbbNotificationIcon } from './notification-directives';

@NgModule({
  imports: [SbbCommonModule, SbbIconModule, SbbNotification, SbbNotificationIcon],
  exports: [SbbNotification, SbbNotificationIcon],
})
export class SbbNotificationModule {}
