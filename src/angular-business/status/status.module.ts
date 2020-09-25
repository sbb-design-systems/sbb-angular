import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbStatus } from './status.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbStatus],
  exports: [SbbStatus],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbStatusModule {}
