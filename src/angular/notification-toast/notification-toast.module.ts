import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNotificationToastContainer } from './notification-toast-container';
import { SbbSimpleNotification } from './simple-notification';

@NgModule({
  imports: [CommonModule, PortalModule, OverlayModule, SbbCommonModule, SbbIconModule],
  declarations: [SbbNotificationToastContainer, SbbSimpleNotification],
  exports: [SbbNotificationToastContainer, SbbSimpleNotification],
})
export class SbbNotificationToastModule {}
