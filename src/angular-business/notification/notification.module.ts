import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconCircleInformationModule,
  IconSignExclamationPointModule,
} from '@sbb-esta/angular-icons/basic';
import { IconCrossModule } from '@sbb-esta/angular-icons/navigation';
import { IconTickModule } from '@sbb-esta/angular-icons/status';

import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NotificationComponent } from './notification/notification.component';
import { Notification } from './notification/notification.service';

@NgModule({
  imports: [
    CommonModule,
    IconCrossModule,
    IconTickModule,
    IconSignExclamationPointModule,
    IconCircleInformationModule,
    IconDirectiveModule,
    PortalModule,
    OverlayModule,
  ],
  declarations: [NotificationComponent, NotificationContainerComponent],
  exports: [NotificationComponent, NotificationContainerComponent, IconDirectiveModule],
  entryComponents: [NotificationContainerComponent],
  providers: [Notification],
})
export class NotificationModule {}
