import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@sbb-esta/angular-core/base/tooltip';
import { SbbIconModule, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER } from '@sbb-esta/angular-core/icon';
import { SbbIconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';

import { SbbTooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  declarations: [SbbTooltipComponent],
  imports: [CommonModule, PortalModule, OverlayModule, SbbIconModule, SbbIconDirectiveModule],
  providers: [SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, ɵSBB_ICON_REGISTRY_WRAPPER_PROVIDER],
  exports: [SbbTooltipComponent, SbbIconDirectiveModule],
})
export class SbbTooltipModule {}
