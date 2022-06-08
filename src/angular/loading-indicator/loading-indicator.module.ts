import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbLoadingIndicator } from './loading-indicator';

@NgModule({
  imports: [CommonModule, SbbCommonModule],
  declarations: [SbbLoadingIndicator],
  exports: [SbbLoadingIndicator],
})
export class SbbLoadingIndicatorModule {}
