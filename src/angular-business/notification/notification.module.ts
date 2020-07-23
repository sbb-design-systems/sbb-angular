import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { NotificationComponent } from './notification/notification.component';

@NgModule({
  imports: [CommonModule, SbbIconModule, IconDirectiveModule],
  declarations: [NotificationComponent],
  exports: [NotificationComponent, IconDirectiveModule],
})
export class NotificationModule {}
