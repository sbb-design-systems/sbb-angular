import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbLoading } from './loading';

@NgModule({
  imports: [CommonModule, SbbCommonModule],
  declarations: [SbbLoading],
  exports: [SbbLoading],
})
export class SbbLoadingModule {}
