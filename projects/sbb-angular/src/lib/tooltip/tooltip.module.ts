import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent, SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from './tooltip/tooltip.component';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [TooltipComponent],
  imports: [
    CommonModule, IconCommonModule, PortalModule, OverlayModule
  ],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [TooltipComponent]
})
export class TooltipModule { }
