import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconCrossModule, IconQuestionMarkModule } from 'sbb-angular-icons';

import { TooltipIconDirective } from './tooltip/tooltip-icon.directive';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, TooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  declarations: [TooltipComponent, TooltipIconDirective],
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    IconQuestionMarkModule,
    IconCrossModule,
  ],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [TooltipComponent, TooltipIconDirective]
})
export class TooltipModule { }
