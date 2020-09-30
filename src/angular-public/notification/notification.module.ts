import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbNotification } from './notification/notification.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, SbbIconDirectiveModule],
  declarations: [SbbNotification],
  exports: [SbbNotification, SbbIconDirectiveModule],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbNotificationModule {}
