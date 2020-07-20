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

import { NotificationSimpleContainerComponent } from './notification-simple-container/notification-simple-container.component';
import { NotificationSimpleComponent } from './notification-simple/notification-simple.component';
import { Notification } from './notification-simple/notification-simple.service';

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
  declarations: [NotificationSimpleComponent, NotificationSimpleContainerComponent],
  exports: [NotificationSimpleComponent, NotificationSimpleContainerComponent, IconDirectiveModule],
  entryComponents: [NotificationSimpleContainerComponent],
  providers: [Notification],
})
export class NotificationSimpleModule {}
