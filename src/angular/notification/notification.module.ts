import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNotification } from './notification';
import { SbbNotificationIcon } from './notification-directives';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbNotification, SbbNotificationIcon],
  exports: [SbbNotification, SbbNotificationIcon],
})
export class SbbNotificationModule {}
