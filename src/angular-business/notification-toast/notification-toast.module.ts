import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbNotificationToastContainer } from './notification-toast-container.component';
import { SbbSimpleNotification } from './simple-notification.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, PortalModule, OverlayModule],
  declarations: [SbbNotificationToastContainer, SbbSimpleNotification],
  exports: [SbbNotificationToastContainer, SbbSimpleNotification, SbbIconDirectiveModule],
  entryComponents: [SbbNotificationToastContainer, SbbSimpleNotification],
})
export class SbbNotificationToastModule {}
