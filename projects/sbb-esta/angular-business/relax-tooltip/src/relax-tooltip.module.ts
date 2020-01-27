import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DefaultTooltipComponent } from './tooltip/default-tooltip.component';
import { TooltipDirective } from './tooltip/tooltip.directive';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [TooltipDirective, DefaultTooltipComponent],
  exports: [DefaultTooltipComponent, TooltipDirective],
  entryComponents: [DefaultTooltipComponent]
})
export class RelaxTooltipModule {}
