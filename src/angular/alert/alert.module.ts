import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAlert } from './alert';
import { SbbAlertOutlet } from './alert-outlet';

@NgModule({
  declarations: [SbbAlert, SbbAlertOutlet],
  imports: [CommonModule, RouterModule, SbbIconModule],
  exports: [SbbAlert, SbbAlertOutlet],
  entryComponents: [SbbAlert],
})
export class SbbAlertModule {}
