import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { SbbCommonModule } from '@sbb-esta/angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';

import { SbbTooltip, TooltipComponent } from './tooltip';
import { SbbTooltipWrapper } from './tooltip-wrapper';

@NgModule({
  imports: [
    A11yModule,
    OverlayModule,
    PortalModule,
    SbbCommonModule,
    SbbIconModule,
    SbbTooltip,
    TooltipComponent,
    SbbTooltipWrapper,
  ],
  exports: [SbbTooltip, TooltipComponent, SbbTooltipWrapper, CdkScrollableModule],
})
export class SbbTooltipModule {}
