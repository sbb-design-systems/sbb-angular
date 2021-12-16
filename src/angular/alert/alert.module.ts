import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbAlert } from './alert';
import { SbbAlertOutlet } from './alert-outlet';

@NgModule({
  declarations: [SbbAlert, SbbAlertOutlet],
  imports: [CommonModule, RouterModule, SbbCommonModule, SbbIconModule],
  exports: [SbbAlert, SbbAlertOutlet],
})
export class SbbAlertModule {}
