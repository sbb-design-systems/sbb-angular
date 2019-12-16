import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IconDirectiveModule } from '@sbb-esta/angular-core/icon-directive';
import {
  IconExclamationPointModule,
  IconSignExclamationPointModule,
  IconSignXModule,
  IconTickModule
} from '@sbb-esta/angular-icons';

import { StatusTooltipComponent } from './status/status-tooltip/status-tooltip.component';
import { StatusTooltipDirective } from './status/status-tooltip/status-tooltip.directive';
import { StatusComponent } from './status/status.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    BrowserModule,
    IconDirectiveModule,
    IconTickModule,
    IconExclamationPointModule,
    IconSignExclamationPointModule,
    IconSignXModule
  ],
  declarations: [StatusComponent, StatusTooltipDirective, StatusTooltipComponent],
  exports: [StatusComponent, StatusTooltipComponent, StatusTooltipDirective],
  entryComponents: [StatusTooltipComponent]
})
export class StatusModule {}
