import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbNotification } from './notification/notification.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, SbbIconDirectiveModule],
  declarations: [SbbNotification],
  exports: [SbbNotification, SbbIconDirectiveModule],
})
export class SbbNotificationModule {}
