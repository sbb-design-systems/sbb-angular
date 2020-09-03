import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';

import { LinkComponent } from './link/link.component';

@NgModule({
  imports: [CommonModule, SbbIconModule],
  declarations: [LinkComponent],
  exports: [LinkComponent],
  providers: [ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class LinksModule {}
