import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  SbbTooltip,
  SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  TooltipComponent,
} from './tooltip';

@NgModule({
  imports: [A11yModule, CommonModule, OverlayModule],
  exports: [SbbTooltip, TooltipComponent, CdkScrollableModule],
  declarations: [SbbTooltip, TooltipComponent],
  entryComponents: [TooltipComponent],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbTooltipModule {}
