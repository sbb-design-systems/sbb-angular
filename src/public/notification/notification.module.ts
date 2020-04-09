import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconCircleInformationModule,
  IconSignExclamationPointModule
} from '@sbb-esta/angular-icons/basic';
import { IconTickModule } from '@sbb-esta/angular-icons/status';

import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    IconTickModule,
    IconSignExclamationPointModule,
    IconCircleInformationModule,
    IconDirectiveModule
  ],
  declarations: [NotificationComponent],
  exports: [NotificationComponent, IconDirectiveModule]
})
export class NotificationModule {}
