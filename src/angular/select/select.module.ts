import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbSelect, SBB_SELECT_SCROLL_STRATEGY_PROVIDER } from './select';

@NgModule({
  imports: [OverlayModule, SbbCommonModule, SbbIconModule, SbbOptionModule, SbbSelect],
  exports: [SbbOptionModule, OverlayModule, SbbSelect],
  providers: [SBB_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class SbbSelectModule {}
