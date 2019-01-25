import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent, SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from './tooltip/tooltip.component';
import { ButtonModule } from '../button/button.module';
import { IconCommonModule } from '../svg-icons-components/icon-common.module';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [TooltipComponent],
  imports: [
    CommonModule, ButtonModule, IconCommonModule, PortalModule
  ],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
  exports: [TooltipComponent]
})
export class TooltipModule { }
