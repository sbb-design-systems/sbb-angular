import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-core/base/tooltip';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { Tooltip } from './tooltip/tooltip';
import { TooltipContainerComponent } from './tooltip/tooltip-container.component';
import { TooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  declarations: [TooltipComponent, Tooltip, TooltipContainerComponent],
  imports: [CommonModule, PortalModule, OverlayModule, SbbIconModule, IconDirectiveModule],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [TooltipComponent, IconDirectiveModule, Tooltip, TooltipContainerComponent],
  entryComponents: [TooltipContainerComponent],
})
export class TooltipModule {}
