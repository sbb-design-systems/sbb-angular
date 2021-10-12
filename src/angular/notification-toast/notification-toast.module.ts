import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNotificationToastContainer } from './notification-toast-container';
import { SbbSimpleNotification } from './simple-notification';

@NgModule({
  imports: [CommonModule, SbbIconModule, PortalModule, OverlayModule],
  declarations: [SbbNotificationToastContainer, SbbSimpleNotification],
  exports: [SbbNotificationToastContainer, SbbSimpleNotification],
  entryComponents: [SbbNotificationToastContainer, SbbSimpleNotification],
})
export class SbbNotificationToastModule {}
