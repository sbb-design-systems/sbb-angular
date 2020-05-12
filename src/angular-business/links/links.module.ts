import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { IconDownloadModule } from '@sbb-esta/angular-icons/basic';

import { LinkComponent } from './link/link.component';

@NgModule({
  imports: [CommonModule, IconArrowRightModule, IconDownloadModule],
  declarations: [LinkComponent],
  exports: [LinkComponent]
})
export class LinksModule {}
