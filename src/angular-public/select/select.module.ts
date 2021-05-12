import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbOptionModule } from '@sbb-esta/angular-public/option';

import { SbbSelect, SBB_SELECT_SCROLL_STRATEGY_PROVIDER } from './select/select.component';

@NgModule({
  imports: [SbbIconModule, SbbOptionModule, CommonModule, OverlayModule],
  declarations: [SbbSelect],
  exports: [SbbOptionModule, OverlayModule, SbbSelect],
  providers: [SBB_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class SbbSelectModule {}
