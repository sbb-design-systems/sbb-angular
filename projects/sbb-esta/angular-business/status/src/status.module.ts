import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconExclamationPointModule,
  IconSignExclamationPointModule,
  IconSignXModule,
  IconTickModule
} from '@sbb-esta/angular-icons';

import { StatusComponent } from './status/status.component';
import { DefaultTooltipComponent } from './status/tooltip/default-tooltip.component';
import { TooltipDirective } from './status/tooltip/tooltip.directive';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    IconDirectiveModule,
    IconTickModule,
    IconExclamationPointModule,
    IconSignExclamationPointModule,
    IconSignXModule
  ],
  declarations: [StatusComponent, TooltipDirective, DefaultTooltipComponent],
  exports: [StatusComponent, DefaultTooltipComponent, TooltipDirective],
  entryComponents: [DefaultTooltipComponent]
})
export class StatusModule {}
