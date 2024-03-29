import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';

import { SbbLoadingIndicator } from './loading-indicator';

@NgModule({
  imports: [SbbCommonModule, SbbLoadingIndicator],
  exports: [SbbLoadingIndicator],
})
export class SbbLoadingIndicatorModule {}
