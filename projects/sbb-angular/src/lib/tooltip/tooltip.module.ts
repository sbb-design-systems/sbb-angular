import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconCloseModule, IconQuestionMarkModule } from '../svg-icons/svg-icons';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, TooltipComponent } from './tooltip/tooltip.component';
import { TooltipIconDirective } from './tooltip/tooltip-icon.directive';

@NgModule({
  declarations: [TooltipComponent, TooltipIconDirective],
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    IconQuestionMarkModule,
    IconCloseModule,
  ],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [TooltipComponent, TooltipIconDirective]
})
export class TooltipModule { }
