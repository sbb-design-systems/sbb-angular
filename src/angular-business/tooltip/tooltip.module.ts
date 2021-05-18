import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-core/base/tooltip';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbTooltip } from './tooltip/tooltip';
import { SbbTooltipContainer } from './tooltip/tooltip-container.component';
import { SbbTooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  declarations: [SbbTooltipComponent, SbbTooltip, SbbTooltipContainer],
  imports: [CommonModule, PortalModule, OverlayModule, SbbIconModule, SbbIconDirectiveModule],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [SbbTooltipComponent, SbbIconDirectiveModule, SbbTooltip, SbbTooltipContainer],
  entryComponents: [SbbTooltipContainer],
})
export class SbbTooltipModule {}
