import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular/icon';

import { SbbSelect, SBB_SELECT_SCROLL_STRATEGY_PROVIDER } from './select/select';

@NgModule({
  imports: [SbbIconModule, SbbOptionModule, CommonModule, OverlayModule],
  declarations: [SbbSelect],
  exports: [SbbOptionModule, OverlayModule, SbbSelect],
  providers: [SBB_SELECT_SCROLL_STRATEGY_PROVIDER, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
})
export class SbbSelectModule {}
