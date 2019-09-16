import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipIconDirective } from '@sbb-esta/angular-public';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { IconCrossModule, IconQuestionMarkModule } from '@sbb-esta/angular-icons';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-public';

@NgModule({
  declarations: [TooltipComponent, TooltipIconDirective],
  imports: [CommonModule, PortalModule, OverlayModule, IconQuestionMarkModule, IconCrossModule],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [TooltipComponent, TooltipIconDirective]
})
export class TooltipModule {}
