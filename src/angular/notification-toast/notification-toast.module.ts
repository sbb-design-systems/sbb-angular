import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbNotificationToastContainer } from './notification-toast-container';
import { SbbSimpleNotification } from './simple-notification';

@NgModule({
  imports: [
    PortalModule,
    OverlayModule,
    SbbCommonModule,
    SbbIconModule,
    SbbNotificationToastContainer,
    SbbSimpleNotification,
  ],
  exports: [SbbNotificationToastContainer, SbbSimpleNotification],
})
export class SbbNotificationToastModule {}
