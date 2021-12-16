import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import {
  SbbTooltip,
  SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER,
  TooltipComponent,
} from './tooltip';
import { SbbTooltipWrapper } from './tooltip-wrapper';

@NgModule({
  imports: [A11yModule, CommonModule, OverlayModule, PortalModule, SbbCommonModule, SbbIconModule],
  exports: [SbbTooltip, TooltipComponent, SbbTooltipWrapper, CdkScrollableModule],
  declarations: [SbbTooltip, TooltipComponent, SbbTooltipWrapper],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class SbbTooltipModule {}
