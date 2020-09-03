import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { StatusComponent } from './status.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [StatusComponent],
  exports: [StatusComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class StatusModule {}
