import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { NotificationToastContainerComponent } from './notification-toast-container.component';
import { SimpleNotificationComponent } from './simple-notification.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, PortalModule, OverlayModule],
  declarations: [NotificationToastContainerComponent, SimpleNotificationComponent],
  exports: [NotificationToastContainerComponent, SimpleNotificationComponent, IconDirectiveModule],
  entryComponents: [NotificationToastContainerComponent, SimpleNotificationComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class NotificationToastModule {}
