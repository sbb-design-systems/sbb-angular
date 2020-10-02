import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { SbbLink } from './link/link.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [SbbLink],
  exports: [SbbLink],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbLinksModule {}
